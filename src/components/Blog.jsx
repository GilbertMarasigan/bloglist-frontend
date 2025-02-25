import { useState } from "react"

const Blog = ({ blog }) => {

  const [visibleDetails, setVisibleDetails] = useState(false)
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = (event) => {
    console.log('toggle')
    console.log('visibleDetails', visibleDetails)
    visibleDetails ? setVisibleDetails(false) : setVisibleDetails(true)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}<button onClick={toggleDetails}>view</button>
        {visibleDetails && (
        <div>
          <div>{blog.url}</div>
          <div>{blog.likes} <button>like</button></div>
          <div>{blog.author}</div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Blog