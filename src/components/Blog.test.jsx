import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
    'title': 'The Lean Startup',
    'author': 'Eric Ries',
    'url': 'https://theleanstartup.com/',
    'likes': 5
}

describe('<Blog />', () => {

    let container

    beforeEach(() => {
        container = render(<Blog blog={blog} />).container
    })

    test('renders title', async () => {
        const title = screen.getByText('The Lean Startup')
        expect(title).toBeDefined()
    })


    test('after clicking the view button renders, author, url and likes', async () => {

        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        const url = screen.getByText('https://theleanstartup.com/')
        const likes = screen.getByText(5)
        const author = screen.getByText('Eric Ries')

        expect(author).toBeDefined()
        expect(likes).toBeDefined()
        expect(url).toBeDefined()

    })


})

describe('<Blog />', () => {
    test('clicking the like button twice calls event handler twice', async () => {
        const likeTwice = vi.fn() // Create a mock function

        const blog = {
            id: '123',  // Ensure an ID exists
            title: 'The Lean Startup',
            author: 'Eric Ries',
            url: 'https://theleanstartup.com/',
            likes: 5,
            user: { username: 'testuser' }
        }

        const user = { username: 'testuser' } // Mock user data

        render(<Blog blog={blog} handleLike={likeTwice} handleDelete={vi.fn()} user={user} />)

        const userEventInstance = userEvent.setup()


        expect(screen.getByText('view')).toBeInTheDocument()


        const viewButton = screen.getByText('view')
        await userEventInstance.click(viewButton)

        const likeButton = screen.getByText('like')
        expect(likeButton).toBeInTheDocument()

        await userEventInstance.click(likeButton)
        await userEventInstance.click(likeButton)

        expect(likeTwice).toHaveBeenCalledTimes(2)
    })
})