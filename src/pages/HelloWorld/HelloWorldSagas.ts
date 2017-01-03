import { put } from 'redux-saga/effects';

export function* increase() {
  yield put({ type: 'increase' });
}

export function* decrease() {
  yield put({ type: 'decrease' });
}