// import types from './types';
import { countTypes } from '../types'

export const increment = () => ({
  type: countTypes.INCREMENT,
})

export const decrement = () => ({
  type: countTypes.DECREMENT,
})

export const incrementAsync = (error) => ({
  type: countTypes.INCREMENT_ASYNC,
})
