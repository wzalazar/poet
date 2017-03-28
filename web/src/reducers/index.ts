import { fetchReducer } from './FetchReducer';
import { modalsReducer } from './ModalsReducer';
import { sessionReducer } from './SessionReducer';
import ProfileReducer from './ProfileReducer';
import { claimSignReducer } from './ClaimSignReducer';
import BlockReducer from './BlockReducer';
import { signTransactionReducer } from './SignTxReducer';
import { transferReducer } from './TransferReducer';
import { navbarReducer } from './NavbarReducer';
import { createWorkReducer } from './CreateWorkReducer';

export default {
  fetch: fetchReducer,
  modals: modalsReducer,
  session: sessionReducer,
  profile: ProfileReducer,
  signTx: signTransactionReducer,
  transfer: transferReducer,
  claimSign: claimSignReducer,
  blocks: BlockReducer,
  navbar: navbarReducer,
  createWork: createWorkReducer
};