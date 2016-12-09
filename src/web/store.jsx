import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { routerReducer } from 'react-router-redux'

import { connectionReducer, connectStoreToEvents } from './events'
import { default as searchReducer } from './search/reducer'

export function configureStore() {
  const store = createStore(combineReducers({
      routing: routerReducer,
      connection: connectionReducer,
      search: searchReducer
    }), 
    compose(
      applyMiddleware(thunk),
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (e) => e
    )
  )

  connectStoreToEvents(store)

  return store
}