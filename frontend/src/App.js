import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom'
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap'

import blogService from './services/blogs'
import loginService from './services/login'

import BlogInfo from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Message'
import Error from './components/Error'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'

import { setMessage } from './reducers/messageReducer'
import { setError } from './reducers/errorReducer'
import { initUsers } from './reducers/userReducer'
import { initBlogs } from './reducers/blogReducer'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      username: '',
      password: '',
      user: null,
      newBlog: null
    }
  }

  componentDidMount = async () => {
    await this.props.initUsers()
    await this.props.initBlogs()
    const blogs = await this.getAll()
    await this.setState({ blogs })
    const userJSON = window.localStorage.getItem('loggedUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      await this.setState({ user })
      await blogService.setToken(user.token)
    }
    console.log('did mount', this.state)
  }

  componentDidUpdate = async () => {
    await this.props.initUsers()
    await this.props.initBlogs()
  }

  getAll = async () => {
    let blogs = await blogService.getAll()
    return blogs.sort((a, b) => (b.likes - a.likes))
  }

  createBlog = async () => {
    const blogs = await this.getAll()
    await this.setState({ blogs })
    this.blogformtoggle.toggleVisibility()
  }

  logout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    this.setState({ username: '', password: '', user: null })
    console.log('user logged out: ', this.state)
  }

  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      this.setState({ username: '', password: '', user })
      console.log('user logged in: ', this.state)
      this.props.setMessage(`Welcome ${this.state.user.name}!`, 5000)
    } catch (exception) {
      console.log(exception)
      this.props.setError('wrong username or password', 5000)
    }
  }

  remove = (id) => {
    return async () => {
      const ind = this.state.blogs.findIndex(function (x) { return x.id === id })
      let blog = this.state.blogs[ind]
      if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
        try {
          blogService.remove(id)
          let blogs = await this.getAll()
          await this.setState({ blogs })
        } catch (exception) {
          console.log(exception)
        }
      }
    }
  }

  like = (id) => {
    const blog = this.state.blogs.filter(blog => blog.id === id)[0]
    return async () => {
      const ind = this.state.blogs.findIndex(function (x) { return x.id === blog.id })
      let likes = this.state.blogs[ind].likes + 1

      let blogs = [...this.state.blogs]
      let blogi = { ...blogs[ind] }
      blogi.likes = likes
      blogs[ind] = blogi
      await this.setState({ blogs })

      try {
        const newBlog = {
          title: blog.title,
          author: blog.author,
          url: blog.url,
          user: blog.user[0] === undefined ? undefined : blog.user[0].id,
          likes
        }
        await blogService.update(newBlog, blog.id)
        this.props.setMessage(`Liked ${blog.title}`, 2000)
      } catch (exception) {
        console.log(exception)
      }
    }
  }

  handleLoginFieldChange = (event) => {
    console.log(event.target.value)
    this.setState({ [event.target.name]: event.target.value })
  }

  loggedInForm = () => {
    const menuStyle = {
      backgroundColor: 'hsl(0, 10%, 75%)',
      borderRadius: 4,
      padding: 10
    }
    const linkStyle = {
      backgroundColor: 'hsl(120, 100%, 75%)',
      color: 'black',
      borderRadius: 4,
      padding: 8,
      textDecoration: 'none',
      marginRight: 8
    }
    const activeLinkStyle = {
      backgroundColor: 'hsl(120, 100%, 25%)',
      color: 'white',
      borderRadius: 4,
      padding: 8,
      textDecoration: 'none',
      marginRight: 8
    }
    return (
      <Router>
        <div>
          <h1>Blog app</h1>
          <div style={menuStyle}>
            <NavLink exact to='/' style={linkStyle} activeStyle={activeLinkStyle}>Blogs</NavLink>&nbsp;
            <NavLink exact to='/users' style={linkStyle} activeStyle={activeLinkStyle}>Users</NavLink>&nbsp;
            {this.state.user.name} logged in <Button onClick={this.logout} style={{ align: 'right' }}>Logout</Button>
          </div>
          <Togglable buttonLabel='Add new blog' ref={component => this.blogformtoggle = component}>
            <BlogForm
              klik={this.createBlog}
            />
          </Togglable>
          <Route exact path='/' render={() => this.blogs()} />
          <Route exact path='/users' render={() => this.usersForm()} />
          <Route exact path="/users/:id" render={({ match }) =>
            <User id={match.params.id} />}
          />
          <Route exact path="/blogs/:id" render={({ match, history }) =>
            <BlogInfo
              id={match.params.id}
              user={this.state.user}
              like={this.like(match.params.id)}
              remove={this.remove(match.params.id)}
              history={history}
            />}
          />
        </div>
      </Router>
    )
  }

  usersForm = () => {
    return (
      <div>
        <Users />
      </div>
    )
  }

  blogs = () => {
    return (
      <ListGroup>
        {this.state.blogs.map(blog => (
          <ListGroupItem key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </Link>
          </ListGroupItem>
        ))}
      </ListGroup>
    )
  }

  loginForm = () => (
    <div>
      <Togglable buttonLabel="Login">
        <LoginForm
          username={this.state.username}
          password={this.state.password}
          handleChange={this.handleLoginFieldChange}
          handleSubmit={this.login}
        />
      </Togglable>
    </div>
  )

  render() {
    console.log('rendering', this.state.blogs)
    return (
      <div className='container'>
        <Notification />
        <Error />
        {this.state.user === null ? this.loginForm() : this.loggedInForm()}
      </div>
    )
  }
}

const LoginForm = ({ handleSubmit, handleChange, username, password }) => {
  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          Username
          <input
            value={username}
            onChange={handleChange}
            name="username"
          />
        </div>
        <div>
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

const mapDispatchToProps = {
  setMessage, setError, initUsers, initBlogs
}


const ConnectedApp = connect(null, mapDispatchToProps)(App)

export default ConnectedApp
