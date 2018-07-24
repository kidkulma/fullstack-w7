import PropTypes from 'prop-types'
import React from 'react'
import Notification from './Message'
import Error from './Error'
import { setMessage } from '../reducers/messageReducer'
import { setError } from '../reducers/errorReducer'
import { addBlog } from '../reducers/blogReducer'
import { connect } from 'react-redux'
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'

class BlogForm extends React.Component {
  static propTypes = {
    klik: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      author: '',
      title: '',
      url: '',
      newBlog: null,
      klik: this.props.klik
    }
  }

  componentDidMount() {
    console.log('BlogForm did mount: ', this.state)
  }

  handleFieldChange = (event) => {
    console.log(event.target.value)
    this.setState({ [event.target.name]: event.target.value })
  }

  Click = async (event) => {
    event.preventDefault()
    const userJSON = window.localStorage.getItem('loggedUser')
    const newBlog = {
      author: this.state.author,
      title: this.state.title,
      url: this.state.url,
      user: JSON.parse(userJSON)
    }
    await this.setState({ author: '', title: '', url: '' })
    await this.setState({ newBlog })
    await this.props.addBlog(newBlog)
    return this.state.klik()
  }

  render() {
    console.log('rendering BlogForm')
    return (
      <div>
        <Notification />
        <Error />
        <h3>Create new</h3>
        <form onSubmit={this.Click}>
          <FormGroup>
            <div>
              <ControlLabel>Title: </ControlLabel>
              <FormControl
                type="text"
                name="title"
                value={this.state.title}
                onChange={this.handleFieldChange}
              />
            </div>
            <div>
              <ControlLabel>Author: </ControlLabel>
              <FormControl
                type="text"
                name="author"
                value={this.state.author}
                onChange={this.handleFieldChange}
              />
            </div>
            <div style={{ marginBottom: 5 }}>
              <ControlLabel>URL: </ControlLabel>
              <FormControl
                type="text"
                name="url"
                value={this.state.url}
                onChange={this.handleFieldChange}
              />
            </div>
            <Button type="submit">Create</Button>
          </FormGroup>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setMessage, setError, addBlog
}


const ConnectedBlogForm = connect(null, mapDispatchToProps)(BlogForm)

export default ConnectedBlogForm