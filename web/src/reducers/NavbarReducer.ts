import { Actions } from '../actions/index';

export interface NavbarAction {
  readonly type: string;
  readonly searchQuery: string;
}

export function navbarReducer(state: any, action: NavbarAction) {
  switch (action.type) {
    case Actions.Navbar.SearchChange:
      return { ...state, searchQuery: action.searchQuery };
  }
  return state || {};
}