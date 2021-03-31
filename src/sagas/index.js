import { all, call } from 'redux-saga/effects'
import countSaga from './count'
import lightningTableSaga, { watchGetLightningData } from './lightningTable'

function* rootSagas() {
  // yield all(lightningTableSaga())
  yield all([call(lightningTableSaga)])
}

export default rootSagas
