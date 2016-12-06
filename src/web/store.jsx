import { createStore, combineReducers } from 'redux'

import { routerReducer } from 'react-router-redux'

import { connectStoreToEvents } from './events'

export function configureStore() {
  const store = createStore(combineReducers({
      routing: routerReducer
    }), 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )

  connectStoreToEvents(store)

  return store
}