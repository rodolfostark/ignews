import { render, screen, fireEvent } from '@testing-library/react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router';
import { SubscribeButton } from '.'

jest.mock('next-auth/react')
jest.mock('next/router')

describe('SubscribeButton component', () => {
    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({ update: null, data: null, status: "unauthenticated"})
       render(
            <SubscribeButton priceId={String(Math.random())} />
        )
        expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
    })

    it('redirects user to sign in when not authenticated', () => {
        const useSessionMocked = jest.mocked(useSession)
        const signInMocked = jest.mocked(signIn)
        useSessionMocked.mockReturnValueOnce({ update: null, data: null, status: "unauthenticated"})
        render(
            <SubscribeButton priceId={String(Math.random())} />
        )
        const subscribeButton = screen.getByText('Subscribe Now')
        fireEvent.click(subscribeButton)
        expect(signInMocked).toHaveBeenCalled()
    })

    it('redirects to posts when user already has a subscription', () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({ update: null, data: {
            user: {
                name: 'John Doe',
                email: 'john.doe@example.com'
            },
            activeSubscription: 'fake-subscription',
            expires: 'fake-expires'
        }, status: "authenticated"})

        const useRouterMocked = jest.mocked(useRouter)
        const pushMock = jest.fn()
        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(
            <SubscribeButton priceId={String(Math.random())} />
        )
        const subscribeButton = screen.getByText('Subscribe Now')
        fireEvent.click(subscribeButton)
        expect(pushMock).toHaveBeenCalledWith('/posts')
    })
})
