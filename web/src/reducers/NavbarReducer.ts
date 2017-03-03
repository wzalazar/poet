import { Actions } from '../actions/index';

export interface NavbarAction {
  readonly type: string;
  readonly searchQuery?: string;
}

export function navbarReducer(state: any, action: NavbarAction) {
  switch (action.type) {
    case Actions.Search.Submit:
      return { ...state };
    case Actions.Search.Change:
      return { ...state, searchQuery: action.searchQuery };
  }
  return state || {};
}