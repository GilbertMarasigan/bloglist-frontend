import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/Login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    console.log('stored user: ', loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      const decodedToken = JSON.parse(atob(user.token.split('.')[1]))

      if (decodedToken.exp * 1000 < Date.now()) {
        console.log('Token expired, logging out')
        handleLogout()
      }
      else {
        setUser(user)
        blogService.setToken(user.token)
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
    window.localStorage.clear()
    setUser(null)
  }

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <div className='user-info'>
        {user.name} logged in  <button type='button' onClick={handleLogout}>logout</button>
      </div>
      {console.log('blogList', blogs)}
      {blogs.map(blog =>
        (<Blog key={blog.id} blog={blog} />)
      )}
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
          {blogList()}
          <BlogForm addBlog={addBlog} />
        </>
      )}
    </div>
  )
}

export default App