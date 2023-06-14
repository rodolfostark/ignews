import { render, screen } from '@testing-library/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

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
})