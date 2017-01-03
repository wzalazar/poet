import { combineReducers, Action } from 'redux'

import { helloWorldReducer } from './pages/HelloWorld/HelloWorldReducer';
import { State } from './state';

export const reducers = combineReducers({
  helloWorldState: helloWorldReducer
}) as (state: State, action: Action) => State;