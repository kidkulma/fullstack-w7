import React from 'react'
import { connect } from 'react-redux'

class Notification extends React.Component {

  render() {
    let { notification } = this.props
    const style = {
      border: notification === '' ? '' : 'solid',
      color: 'green',
      backgroundColor: 'hsl(120, 100%, 75%)',
      borderRadius: 4,
      padding: notification === '' ? 0 : 10,
      borderWidth: notification === '' ? 0 : 1,
      marginTop: notification === '' ? 65 : 5
    }
    return (
      <div style={style}>
        {notification}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}


const ConnectedNotification = connect(mapStateToProps)(Notification)

export default ConnectedNotification