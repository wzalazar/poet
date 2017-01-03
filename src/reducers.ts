import { combineReducers, Action } from 'redux'

import { helloWorldReducer } from './pages/HelloWorld/HelloWorldReducer';

export const reducers = combineReducers({
  helloWorldState: helloWorldReducer
}) as (state: any, action: Action) => any;