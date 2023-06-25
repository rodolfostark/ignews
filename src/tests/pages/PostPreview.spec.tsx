import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next/router')
jest.mock('next-auth/react')
jest.mock('../../services/prismic')

const post = {
    slug: 'my-new-post',
    title: 'My New Post',
    content: '<p>My New Post Excerpt</p>',
    updatedAt: '06-11-2023'
}

describe('Post preview page', () => {
    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({
            update: null,
            data: null,
            status: "unauthenticated"
        })
        render(
            <Post post={post} />
        )
        expect(screen.getByText("My New Post")).toBeInTheDocument()
        expect(screen.getByText("My New Post Excerpt")).toBeInTheDocument()
        expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
    })

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = jest.mocked(useSession)
        const useRouterMocked = jest.mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce({
            update: null,
            data: {
                user: {
                    name: 'John Doe',
                    email: 'john.doe@example.com'
                },
                activeSubscription: 'fake-subscription',
                expires: 'fake-expires'
            },
            status: "authenticated"
        })

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(
            <Post post={post} />
        )
        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = jest.mocked(getPrismicClient)
        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                uid: 'my-new-post',
                data: {
                    title: [
                        { type: 'heading', text: 'My New Post' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post Excerpt' }
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        } as any)
        
        const response = await getStaticProps({
            params: {
                slug: 'my-new-post'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My New Post',
                        content: '<p>Post Excerpt</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )
    })
})