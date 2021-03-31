import { combineReducers } from 'redux'
import countReducer from './count'
import lightningTableReducer from './lightningTable'

const rootReducer = combineReducers({
  countReducer,
})

export default rootReducer
