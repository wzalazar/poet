import FetchReducer from './FetchReducer';
import ModalsReducer from './ModalsReducer';
import SessionReducer from './SessionReducer';
import ClaimSign from './ClaimSignReducer';
import BlockReducer from './BlockReducer';
import SignTxReducer from './SignTxReducer';

export default {
  fetch: FetchReducer,
  modals: ModalsReducer,
  session: SessionReducer,
  signTx: SignTxReducer,
  claimSign: ClaimSign,
  blocks: BlockReducer
};