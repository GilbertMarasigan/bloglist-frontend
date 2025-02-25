import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {

    const [visibleDetails, setVisibleDetails] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const toggleDetails = (event) => {
        visibleDetails ? setVisibleDetails(false) : setVisibleDetails(true)
    }

    const increaseLikes = () => {

        if (!blog || !blog.id) {
            console.error('Error: Blog or Blog ID is undefined!')
            return
        }

        const updatedBlog = { ...blog, likes: blog.likes + 1 }
        handleLike(blog.id, updatedBlog)
    }

    const deleteBlog = () => {

        if (!blog || !blog.id) {
            console.error('Error: Blog or Blog ID is undefined!')
            return
        }

        window.confirm(`Remove ${blog.title}`) && handleDelete(blog.id)

    }

    const showRemoveButton = user && blog.user.username === user.username

    console.log(`is from ${blog.author}`)


    return (
        <div style={blogStyle}>
            <div>
                {blog.title}<button onClick={toggleDetails}>view</button>
                {visibleDetails && (
                    <div>
                        <div>{blog.url}</div>
                        <div>{blog.likes} <button onClick={increaseLikes}>like</button></div>
                        <div>{blog.author}</div>
                        <div>
                            {showRemoveButton && <button onClick={deleteBlog}>remove</button>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    handleLike: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

export default Blog