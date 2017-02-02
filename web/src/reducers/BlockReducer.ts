import Actions from '../actions';

export default function blockReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.blockInfoReceived:
      return action.payload;
  }
  return state || [];
}
