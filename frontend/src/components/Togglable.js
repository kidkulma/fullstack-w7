import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

class Togglable extends React.Component {
  static propTypes = {
    buttonLabel: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' }
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }

    return (
      <div  style={ { marginBottom: 10, marginTop: 10 } }>
        <div style={hideWhenVisible}>
          <Button onClick={this.toggleVisibility}>{this.props.buttonLabel}</Button>
        </div>
        <div style={showWhenVisible}>
          {this.props.children}
          <Button onClick={this.toggleVisibility}>Cancel</Button>
        </div>
      </div>
    )
  }
}

export default Togglable