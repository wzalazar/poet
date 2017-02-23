import { Actions } from '../actions/index';
import { WORK, Claim } from '../Claim';
import { CreateWorkStore } from '../store/PoetAppState';

export function createWorkReducer(state: any, action: any): CreateWorkStore {
  switch (action.type) {
    case Actions.Claims.SubmittedSuccess:
      const workClaim = action.claims.find((claim: Claim) => claim.type === WORK) as Claim;
      return { ...state, workClaim };
  }
  return state || {};
}