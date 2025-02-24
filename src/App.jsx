import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" })
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

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type="text"
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password
          <input type="password"
            value={password}
            name='Password'
            onChange={({ target }) =>
              setPassword(target.value)} />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )

  const addBlog = async (event) => {
    event.preventDefault()

    console.log('addBlog', newBlog)

    try {
      blogService.setToken(user.token)
      const returnedBlog = await blogService.create(newBlog)

      setBlogs((prevBlogs) => [...prevBlogs, returnedBlog])
      setNewBlog({ title: "", author: "", url: "" })
    } catch (error) {
      console.log('error', error)
    }

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewBlog((prev) => ({ ...prev, [name]: value }))
  }

  const blogForm = () => (
    <div>
      <form onSubmit={addBlog}>
        <h2>create new</h2>
        <div>
          title: <input type="text"
            name='title'
            value={newBlog.title}
            onChange={handleChange} />
        </div>
        <div>
          author: <input type="text"
            name='author'
            value={newBlog.author}
            onChange={handleChange} />
        </div>

        <div>
          url: <input type="text"
            name='url'
            value={newBlog.url}
            onChange={handleChange} />
        </div>

        <button type='submit'>create</button>
      </form>
    </div>
  )

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
      {user === null ? (loginForm()) : (
        <>
          {blogList()}
          {blogForm()}
        </>
      )}
    </div>
  )
}

export default App