const initialState = {
  data: {},
  loading: false,
  error: '',
}

function lightningTable(state = initialState, action) {
  const { type } = action
  switch (type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

export default lightningTable
