// import types from './types';
import { lightningTableTypes } from '../types'

export const getData = () => ({
  type: lightningTableTypes.GET_DATA,
})

export const getDataSuccess = (payload) => ({
  type: lightningTableTypes.GET_DATA_SUCESS,
  payload,
})

export const getDataFailure = (payload) => ({
  type: lightningTableTypes.GET_DATA_FAILURE,
  payload,
})

export const getDataAsync = (error) => ({
  type: lightningTableTypes.GET_DATA_ASYNC,
})
