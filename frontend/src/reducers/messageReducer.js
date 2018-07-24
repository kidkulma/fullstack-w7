const defaultMessage = ''

const notificationReducer = (store = defaultMessage, action) => {
  switch (action.type) {
  case 'REMOVE':
    return ''
  case 'MESSAGE':
    return action.content
  default:
    return store
  }
}

export const setMessage = (content, time) => {
  return async (dispatch) => {
    dispatch(message(content))
    setTimeout(() => dispatch(remove()), time)
  }
}

const message = (content) => {
  return {
    type: 'MESSAGE',
    content
  }
}

const remove = () => {
  return {
    type: 'REMOVE'
  }
}

export default notificationReducer