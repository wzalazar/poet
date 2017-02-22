import { fetchSaga } from './FetchSaga';
import { navbarSaga } from './NavbarSaga';
import { sessionSaga } from './SessionSaga';
import ProfileSaga from './ProfileSaga';
import SignTxSaga from './SignTxSaga';
import SubmitClaims from './SubmitClaims';
import TransferSaga from './TransferSaga';

import Withdrawal from './Withdrawal';
import PayForLicense from './PayForLicense';
import { CacheInvalidationSaga } from './CacheInvalidationSaga';

export default [
  fetchSaga,
  navbarSaga,
  sessionSaga,
  TransferSaga,
  ProfileSaga,
  SubmitClaims,
  SignTxSaga,
  Withdrawal,
  PayForLicense,
  CacheInvalidationSaga
];