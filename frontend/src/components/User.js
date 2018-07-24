import React from 'react'
import { connect } from 'react-redux'


class User extends React.Component {

  render() {
    let user = this.props.users.filter(user => user.id === this.props.id)
    user = user[0]

    return (
      <div>
        <h2>{user.name}</h2>
        <h3>Added blogs</h3>
        <ul>
          {user.blogs.map(blog =>
            <li key={blog._id}>{blog.title} by {blog.author}</li>
          )}
        </ul>
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users
  }
}


const ConnectedUser = connect(mapStateToProps)(User)

export default ConnectedUser