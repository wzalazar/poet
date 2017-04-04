import { fetchSaga } from './FetchSaga';
import { navbarSaga } from './NavbarSaga';
import { sessionSaga } from './SessionSaga';
import ProfileSaga from './ProfileSaga';
import SignTxSaga from './SignTxSaga';
import { submitClaims } from './SubmitClaims';
import { transferSaga } from './TransferSaga';
import Withdrawal from './Withdrawal';
import { purchaseLicenseSaga } from './PurchaseLicense';
import { CacheInvalidationSaga } from './CacheInvalidationSaga';
import { createWorkSaga } from './CreateWorkSaga';
import { tryItOut } from './TryItOut';

export default [
  fetchSaga,
  navbarSaga,
  sessionSaga,
  transferSaga,
  ProfileSaga,
  submitClaims,
  SignTxSaga,
  Withdrawal,
  purchaseLicenseSaga,
  CacheInvalidationSaga,
  createWorkSaga,
  tryItOut
];