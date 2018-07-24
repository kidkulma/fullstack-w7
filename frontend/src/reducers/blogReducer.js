import blogService from '../services/blogs'

const initialBlogs = []

const blogReducer = (store = initialBlogs, action) => {
  if (action.type === 'INITBLOGS') {
    return action.data
  }
  if (action.type === 'ADDBLOG') {
    return [...store, action.data]
  }
  return store
}

export const initBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INITBLOGS',
      data: blogs
    })
  }
}

export const addBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'ADDBLOG',
      data: newBlog
    })
  }
}

export default blogReducer