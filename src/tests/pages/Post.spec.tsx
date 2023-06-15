import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'

import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

describe('Post page', () => {
    it('renders correctly', () => {
        const post = {
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>My New Post Excerpt</p>',
            updatedAt: '06-11-2023'
        }
        render(
            <Post post={post} />
        )
        expect(screen.getByText("My New Post")).toBeInTheDocument()
        expect(screen.getByText("My New Post Excerpt")).toBeInTheDocument()
    })

    it('redirects user if no subscription is found', async () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({ 
            update: null, 
            data: null, 
            status: "unauthenticated",
            activeSubscription: null
        })
        const response = await getServerSideProps({
            req: {
                cookies: {},
            },
            params: {
                slug: 'my-new-post'
            }
        } as any)
        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/'
                })
            })
        )
    })
})