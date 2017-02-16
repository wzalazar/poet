import { fetchSaga } from './FetchSaga';
import NavbarSaga from './NavbarSaga';
import SessionSaga from './SessionSaga';
import ProfileSaga from './ProfileSaga';
import SignTxSaga from './SignTxSaga';
import SubmitClaims from './SubmitClaims';
import TransferSaga from './TransferSaga';

import Withdrawal from './Withdrawal';
import PayForLicense from './PayForLicense';
import { CacheInvalidationSaga } from './CacheInvalidationSaga';

export default [
  fetchSaga,
  NavbarSaga,
  SessionSaga,
  TransferSaga,
  ProfileSaga,
  SubmitClaims,
  SignTxSaga,
  Withdrawal,
  PayForLicense,
  CacheInvalidationSaga
];