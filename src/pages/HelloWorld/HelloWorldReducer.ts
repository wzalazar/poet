import { Action } from 'redux';

export function countIncreaseReducer(count: number = 0, action: Action) {
  if (action.type == 'increase') {
    return count + 1;
  }
  return count
}