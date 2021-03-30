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

export const DATE_FORMAT = 'HH:mm:ss'

export const getTime = (time) => {
  const isInvalidTime = time
    .toString()
    .split(':')
    .some((item) => isNaN(parseInt(item))) // check time only contain number
  if (isInvalidTime) return ''

  const timeResult = moment(time, DATE_FORMAT)
  if (!timeResult.isValid()) return ''

  return timeResult
}

export const timeDiffInSecond = ({ time1, time2 }) => {
  return moment.duration(time2.diff(time1)).asSeconds()
}

export const addSeconds = ({ time, seconds }) => {
  let time2 = moment(time, DATE_FORMAT)
  time2 = time2.add(seconds, 'seconds').format(DATE_FORMAT)
  return moment(time2, DATE_FORMAT).format(DATE_FORMAT)
}

// export const add = ({ time, seconds }) => {
//   let time2 = moment(time)
//   const dateFormat = 'HH:mm:ss'
//   time2 = time2.add(seconds, 'seconds').format(dateFormat)
//   return moment(time2, dateFormat)
// }

// let t1 = '09:29:11'
// const dateFormat = 'HH:mm:ss'
// const time1 = momentjs(t1, dateFormat)
// let time2 = addSeconds({ time: time1, seconds: 25 })

// console.log(
//   timeDiffInSecond({
//     time1,
//     time2,
//   })
// )
