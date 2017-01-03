import { Action } from 'redux';

export function countReducer(count: number = 0, action: Action) {
  if (action.type == 'increase') {
    return count + 1;
  }
  if (action.type == 'decrease') {
    return count - 1;
  }
  return count
}