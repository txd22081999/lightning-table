import axios from "axios"
import data from "./mockData.json"

const HOST = "http://113.161.34.115:5016"
const END_POINT = "cacom-table"

export const getData = async () => {
  const response = await axios.get(`${HOST}/${END_POINT}`)
  return response
}

export const MOCK_DATA = require("./mockData.json")
