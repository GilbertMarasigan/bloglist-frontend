import { useState } from 'react'

const BlogForm = ({ addBlog }) => {

    const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewBlog((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        addBlog(newBlog)
        setNewBlog({ title: '', author: '', url: '' })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>create new</h2>
                <div>
                    title: <input type="text"
                        data-testid='title'
                        name='title'
                        value={newBlog.title}
                        onChange={handleChange} />
                </div>
                <div>
                    author: <input type="text"
                        data-testid='author'
                        name='author'
                        value={newBlog.author}
                        onChange={handleChange} />
                </div>

                <div>
                    url: <input type="text"
                        data-testid='url'
                        name='url'
                        value={newBlog.url}
                        onChange={handleChange} />
                </div>

                <button type='submit'>create</button>
            </form>
        </div>
    )

}


export default BlogForm