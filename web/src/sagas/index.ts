import { fetchSaga } from './FetchSaga';
import { workSearchSaga } from './NavbarSaga';
import { sessionSaga } from './SessionSaga';
import ProfileSaga from './ProfileSaga';
import { signTransaction } from './SignTxSaga';
import { submitClaims } from './SubmitClaims';
import { transferSaga } from './TransferSaga';
import Withdrawal from './Withdrawal';
import { purchaseLicenseSaga } from './PurchaseLicense';
import { CacheInvalidationSaga } from './CacheInvalidationSaga';
import { createWorkSaga } from './CreateWorkSaga';
import { tryItOut } from './TryItOut';
import { notificationsSaga } from './Notifications';

export default [
  fetchSaga,
  workSearchSaga,
  sessionSaga,
  transferSaga,
  ProfileSaga,
  submitClaims,
  signTransaction,
  Withdrawal,
  purchaseLicenseSaga,
  CacheInvalidationSaga,
  createWorkSaga,
  tryItOut,
  notificationsSaga
];