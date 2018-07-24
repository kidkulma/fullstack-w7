const defaultError = ''

const notificationReducer = (store = defaultError, action) => {
  switch (action.type) {
  case 'REMOVE':
    return ''
  case 'ERROR':
    return action.content
  default:
    return store
  }
}

export const setError = (content, time) => {
  return async (dispatch) => {
    dispatch(error(content))
    setTimeout(() => dispatch(remove()), time)
  }
}

const error = (content) => {
  return {
    type: 'ERROR',
    content
  }
}

const remove = () => {
  return {
    type: 'REMOVE'
  }
}

export default notificationReducer