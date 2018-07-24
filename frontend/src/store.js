import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import messageReducer from './reducers/messageReducer'
import errorReducer from './reducers/errorReducer'
import userReducer from './reducers/userReducer'
import blogReducer from './reducers/blogReducer'

const reducer = combineReducers({
  notification: messageReducer,
  error: errorReducer,
  users: userReducer,
  blogs: blogReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store