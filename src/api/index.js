import axios from 'axios'

export const getReplayerData = async () => {
  const response = await axios.get(
    `http://113.161.34.115:5025/end-point/snapshot-outbound`
  )
  return response
}

export const getBSData = async () => {
  const response = await axios.get(
    `http://113.161.34.115:5025/end-point/bs-nn-outbound`
  )
  return response
}
