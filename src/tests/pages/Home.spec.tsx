import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import Home from '../../pages'


jest.mock('next-auth/react')

describe('Home page', () => {
    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({ update: null, data: null, status: "unauthenticated"})
        render(
            <Home product={{priceId: 'fake-price-id', amount: "$9.90"}} />
        )
        expect(screen.getByText("for $9.90 month")).toBeInTheDocument()
    })
})