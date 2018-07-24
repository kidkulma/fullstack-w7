import React from 'react'
import { connect } from 'react-redux'

class Error extends React.Component {

  render() {
    let { error } = this.props
    const style = {
      border: error === '' ? '' : 'solid',
      color: 'red',
      padding: error === '' ? 0 : 10,
      borderWidth: error === '' ? 0 : 1
    }
    return (
      <div style={style}>
        {error}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.error
  }
}


const ConnectedError = connect(mapStateToProps)(Error)

export default ConnectedError