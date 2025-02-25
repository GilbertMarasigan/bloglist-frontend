import { useState } from "react"

const Blog = ({ blog, handleLike }) => {

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
      console.error("Error: Blog or Blog ID is undefined!");
      return;
    }
    
    const updatedBlog = {...blog, likes: blog.likes + 1}
    handleLike(blog.id, updatedBlog)
  } 


  return (
    <div style={blogStyle}>
      <div>
        {blog.title}<button onClick={toggleDetails}>view</button>
        {visibleDetails && (
        <div>
          <div>{blog.url}</div>
          <div>{blog.likes} <button onClick={increaseLikes}>like</button></div>
          <div>{blog.author}</div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Blog