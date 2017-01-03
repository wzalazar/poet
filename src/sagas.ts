import { takeEvery } from 'redux-saga';

import { increase, decrease } from './pages/HelloWorld/HelloWorldSagas';

export default function* sagas() {
  yield takeEvery('increase requested', increase);
  yield takeEvery('decrease requested', decrease);
};