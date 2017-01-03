import { Action } from 'redux';

import { HelloWorldState, helloWorldState } from './HelloWorldState';

export function helloWorldReducer(state: HelloWorldState = helloWorldState, action: Action): HelloWorldState {
  console.log('helloWorldReducer', state);
  if (action.type == 'increase') {
    return {
      count: state.count + 1
    };
  }
  if (action.type == 'decrease') {
    return {
      count: state.count - 1
    };
  }
  return state
}