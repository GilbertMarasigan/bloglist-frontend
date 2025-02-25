import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/Login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)


    useEffect(() => {
        blogService.getAll().then(blogs => {
            const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
            setBlogs(sortedBlogs)
        }
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        console.log('stored user: ', loggedUserJSON)

        if (loggedUserJSON) {
            try {
                const user = JSON.parse(loggedUserJSON)
                const decodedToken = JSON.parse(atob(user.token.split('.')[1]))

                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log('Token expired, logging out')
                    setUser(null)
                    window.localStorage.clear()
                } else {
                    setUser(user)
                    blogService.setToken(user.token)
                }
            } catch (error) {
                console.error('Error parsing stored user:', error)
                setUser(null)
                window.localStorage.clear()
            }
        }
    }, [])

    const addBlog = async (blogData) => {
        try {
            blogService.setToken(user.token)
            const returnedBlog = await blogService.create(blogData)

            setBlogs((prevBlogs) => [...prevBlogs, returnedBlog])
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleLike = async (id, updatedBlog) => {

        console.log('add like')

        if (!id) {
            console.error('Error: Blog ID is undefined!')
            return
        }


        try {
            blogService.setToken(user.token)
            const returnedBlog = await blogService.update(id, updatedBlog)

            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) => (blog.id === id ? returnedBlog : blog))
            )
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleDelete = async (id) => {

        console.log('delete blog')

        if (!id) {
            console.error('Error: Blog ID is undefined!')
            return
        }

        try {
            blogService.setToken(user.token)

            const deleteBlog = await blogService.deleteBlog(id)

            setBlogs((prevBlogs) =>
                prevBlogs.filter(blog => blog.id !== id)
            )

        } catch (error) {

            console.log('error', error)

            const errorMsg = 'Blogs can only be deleted by author'

            if (error.response.data.error === errorMsg) {

                setErrorMessage(errorMsg)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            }

        }

    }

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            // declare user and get it fomr login service
            const user = await loginService.login({
                username, password
            })

            // storage in localstore the user info and token
            window.localStorage.setItem(
                'loggedBlogAppUser',
                JSON.stringify(user)
            )

            console.log('user', user)
            // set token in service
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (error) {
            setErrorMessage('wrong username or password')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const handleLogout = (event) => {
        console.log(`loggin out ${user.name}`)
        setUser(null)
        window.localStorage.clear()
    }

    const blogList = () => (
        <div>
            {blogs.map(blog => (
                <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} user={user} />
            ))}
        </div>
    )

    return (
        <div>
            <Notification message={errorMessage} />
            {user === null ? (
                <Togglable buttonLabel='login'>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                </Togglable>
            ) : (
                <>
                    <h2>blogs</h2>
                    <div className='user-info'>
                        {user.name} logged in  <button type='button' onClick={handleLogout}>logout</button>
                    </div>
                    <Togglable buttonLabel='create new blog'>
                        <BlogForm addBlog={addBlog} />
                    </Togglable>
                    {blogList()}
                </>
            )}
        </div>
    )
}

export default App