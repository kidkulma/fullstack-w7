import React from 'react'
import { connect } from 'react-redux'
import { initBlogs } from '../reducers/blogReducer'
import { Button } from 'react-bootstrap'


class BlogInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      like: this.props.like,
      remove: this.props.remove,
      user: this.props.user
    }
  }

  remove = async () => {
    await this.props.remove()
    return this.props.history.push('/')
  }

  render() {
    let blog = this.props.blogs.filter(blog => blog.id === this.props.id)[0]
    let visible = ''
    if (blog.user.length !== 0 && blog.user[0]._id !== this.state.user.id) {
      visible = 'none'
    }
    return (
      <div>
        <h2>{blog.title} by {blog.author}</h2>
        <p>URL: <a href={blog.url}>{blog.url}</a></p>
        <p>Has {blog.likes} likes <Button onClick={this.state.like}>Like</Button> </p>
        <p>Added by {blog.user.length === 0 ? 'anonymous' : blog.user[0].name}</p>
        <div style={{ display: visible }}><Button onClick={this.remove}>Delete</Button></div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs
  }
}

const mapDispatchToProps = {
  initBlogs
}


const ConnectedBlogInfo = connect(mapStateToProps, mapDispatchToProps)(BlogInfo)

export default ConnectedBlogInfo