import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { describe } from 'vitest'

describe('<BlogForm />', () => {
    test('check, that the form calls the event handler it received as props with the right details when a new blog is created', async async => {
        const addBlog = vi.fn()

        const user = userEvent.setup()

        render(<BlogForm addBlog={addBlog} />)

        const submitFormButton = screen.getByText('create')
        await user.click(submitFormButton)

        expect(addBlog.mock.calls).toHaveLength(1)
    })


})