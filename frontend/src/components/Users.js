import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'


class Users extends React.Component {
  render() {
    return (
      <div>
        <h2>Users</h2>
        <table>
          <tbody>
            <tr><td></td><td><h3>Blogs added</h3></td></tr>
            {this.props.users.map(user =>
              <tr key={user.id}><td><Link to={`/users/${user.id}`}>{user.name}</Link></td><td style={{ textAlign: 'center' }}>{user.blogs.length}</td></tr>
            )}
          </tbody>
        </table >
      </div >
    )
  }

}

const mapStateToProps = (state) => {
  return {
    users: state.users
  }
}


const ConnectedUsers = connect(mapStateToProps)(Users)

export default ConnectedUsers