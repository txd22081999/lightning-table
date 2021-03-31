import { combineReducers } from 'redux'
import countReducer from './count'
import lightningTableReducer from './lightningTable'

const rootReducer = combineReducers({
  count: countReducer,
  lightningTable: lightningTableReducer,
})

export default rootReducer
