import { combineReducers, Action } from 'redux'

import { countReducer } from './pages/HelloWorld/HelloWorldReducer';

export const reducers = combineReducers({
  count: countReducer
}) as (state: any, action: Action) => any;