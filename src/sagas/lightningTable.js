import { all, call, delay, put, takeEvery } from 'redux-saga/effects'
import { lightningTableTypes as types } from '../types'
import { getReplayerData } from '../api'

function* getData() {
  const response = yield call(getReplayerData)
  const { status, data = {} } = response
  if (status !== 200) {
    console.error('Fetch data failed')
    // console.error();
  }
  // console.log(data)
  yield put({ type: types.GET_DATA_SUCCESS, payload: { data } })
}

export function* watchGetLightningData() {
  yield takeEvery(types.GET_DATA, getData)
}

// single entry point to start all Sagas at once
export default function* lightningTableSaga() {
  yield all([call(watchGetLightningData)])
}
