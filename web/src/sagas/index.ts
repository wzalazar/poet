import { fetchSaga } from './FetchSaga';
import { navbarSaga } from './NavbarSaga';
import { sessionSaga } from './SessionSaga';
import ProfileSaga from './ProfileSaga';
import SignTxSaga from './SignTxSaga';
import SubmitClaims from './SubmitClaims';
import TransferSaga from './TransferSaga';
import Withdrawal from './Withdrawal';
import { purchaseLicenseSaga } from './PurchaseLicense';
import { CacheInvalidationSaga } from './CacheInvalidationSaga';
import { createWorkSaga } from './CreateWorkSaga';

export default [
  fetchSaga,
  navbarSaga,
  sessionSaga,
  TransferSaga,
  ProfileSaga,
  SubmitClaims,
  SignTxSaga,
  Withdrawal,
  purchaseLicenseSaga,
  CacheInvalidationSaga,
  createWorkSaga
];