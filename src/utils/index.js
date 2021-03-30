import axios from 'axios'
import data from './mockData.json'
import moment from 'moment'

const HOST = 'http://113.161.34.115:5016'
const END_POINT = 'cacom-table'

export const getData = async () => {
  const response = await axios.get(`${HOST}/${END_POINT}`)
  return response
}

export const MOCK_DATA = require('./mockData.json')

export const getTime = (time) => {
  const isInvalidTime = time.split(':').some((item) => isNaN(parseInt(item))) // check time only contain number
  if (isInvalidTime) return ''

  const dateFormat = 'HH:mm:ss'
  const timeResult = moment(time, dateFormat)
  if (!timeResult.isValid()) return ''

  // return timeResult.toDate()
  return timeResult
}

export const timeDiffInSecond = ({ time1, time2 }) => {
  return moment.duration(time2.diff(time1)).asSeconds()
}
