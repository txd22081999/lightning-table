import { countTypes } from '../types'
const initialState = 0

function count(state = initialState, action) {
  switch (action.type) {
    case countTypes.INCREMENT:
      return state + 1
    case countTypes.DECREMENT:
      return state - 1
    default:
      return state
  }
}

export default count
