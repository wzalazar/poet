import FetchReducer from './FetchReducer';
import ModalsReducer from './ModalsReducer';
import SessionReducer from './SessionReducer';
import ClaimSign from './ClaimSignReducer';
import BlockReducer from './BlockReducer';

export default {
  fetch: FetchReducer,
  modals: ModalsReducer,
  session: SessionReducer,
  claimSign: ClaimSign,
  blocks: BlockReducer
};