export namespace Actions {
  export const loginButtonClicked = 'login button clicked';
  export const logoutButtonClicked = 'logout button clicked';
  export const loginModalDisposeRequested = 'login modal dispose requested';
  export const navbarSearchClick = 'navbar search click';
  export const navbarSearchChange = 'navbar search change';
  export const fetchRequest = 'fetch requested';
  export const loginResponse = 'login response'; // TODO: this one should be dispatched by a saga
  export const claimsSubmitRequested = 'claims submit requested';
  export const claimsModalDismissRequested = 'dismiss work modal';

  export const loginSuccess = 'login success';
  export const loginModalShow = 'login modal open';
  export const loginModalHide = 'login modal close';
  export const logoutRequested = 'logout requested';

  export const fetchResponseSuccess = 'fetch response success';
  export const fetchResponseError = 'fetch response error';

  export const claimsSigned = 'claim signed';
  export const claimsSubmitedSuccess = 'create claim success';
  export const claimsSubmitting = 'submitting claims';

  export const signClaimsModalShow = 'show sign claims modal';
  export const signClaimsModalHide = 'hide sign claims modal';

  export const updatingProfile = 'updating profile';
  export const profileUpdated = 'profile updated successfully';
  export const updateProfileRequested = 'profile update requested';

  export const loginIdReceived = 'login ID received';
  export const unrecognizedSocketMessage = 'unrecognized socket message';
  export const mockLoginRequest = 'mock login server requested';

  export const claimsResponse = 'claim response for signature';
  export const claimIdReceived = 'request id for authorizing claim received';
  export const fakeClaimSign = 'fake sign claim requested';

  export const blockInfoReceived = 'block info received';

  export const signTxSubmitRequested = 'sign tx submit requested';
  export const signTxModalDismissRequested = 'sign tx dismiss modal received';
  export const fakeTxSign = 'fake sign requested';
  export const txSubmittedSuccess = 'tx submitted';
  export const signTxIdReceived = 'sign tx id received';
  export const signTxModalHide = 'sign tx modal hide';
  export const signTxModalShow = 'sign tx modal show';
  export const submittingTx = 'submitting tx';

  export const fetchProfileData = 'fetch profile data';
  export const profileDataFetched = 'profile data fetched';

  export const payForLicenseRequested = 'pay for license';
  export const licensePaid = 'license paid';

  export const withdrawalRequested = 'withdrawal started';
  export const withdrawalDone = 'withdrawal done';

  export const noBalanceAvailable = 'no balance available';
  export const transferRequested = 'transfer work requested';

  export const fakeTransferSign = 'fake transfer sign requested';
  export const setTransferTarget = 'transfer work target set';
  export const transferIdReceived = 'transfer id to sign received';

  export const transferSuccess = 'transfer success';

  export const transferModalShow = 'transfer modal show';
  export const transferModalHide = 'transfer modal hide';
  export const transferModalDismissRequested = 'transfer modal dismiss requested';
  export const transferDismissed = 'transfer work modal dismissed';

  export const purchaseLicenseModalShow = 'purchase license modal show';
  export const purchaseLicenseModalAccept = 'purchase license modal accept';
  export const purchaseLicenseModalCancel = 'purchase license modal cancel';
}