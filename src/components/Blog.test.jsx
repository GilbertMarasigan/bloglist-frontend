import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

    let container

    const blog = {
        'title': 'The Lean Startup',
        'author': 'Eric Ries',
        'url': 'https://theleanstartup.com/',
        'likes': 5
    }

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

        screen.debug()

    })

})


