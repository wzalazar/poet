import * as React from 'react'

import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import * as ReactDOM from 'react-dom'

ReactDOM.render(
  <h1>Hi</h1>,
  document.getElementById('app')
)
