import { lightningTableTypes } from '../types'

const initialState = {
  data: {},
  loading: false,
  error: null,
}

function lightningTable(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case lightningTableTypes.GET_DATA:
      return {
        ...state,
        loading: true,
      }
    case lightningTableTypes.GET_DATA_SUCCESS: {
      console.log('PAYLOAD', payload)
      return {
        ...state,
        data: payload.data,
        loading: false,
        error: null,
      }
    }
    case lightningTableTypes.GET_DATA_FAILURE:
      return {
        ...state,
        data: [],
        loading: false,
        error: payload.error,
      }
    default:
      return state
  }
}

export default lightningTable
