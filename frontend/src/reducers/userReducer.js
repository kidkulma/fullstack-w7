import userService from '../services/users'

const initialUsers = []

const userReducer = (store = initialUsers, action) => {
  if (action.type === 'INITUSERS') {
    return action.data
  }
  return store
}

export const initUsers = () => {
  return async (dispatch) => {
    const users = await userService.getUsers()
    dispatch({
      type: 'INITUSERS',
      data: users
    })
  }
}

export default userReducer