export default class Actions {
  // ComponentActions: dispatched by a component, listened by a saga — these are more like Events
  public static readonly loginButtonClicked = 'login button clicked';
  public static readonly logoutButtonClicked = 'logout button clicked';
  public static readonly loginModalDisposeRequested = 'login modal dispose requested';
  public static readonly navbarSearchClick = 'navbar search click';
  public static readonly fetchRequest = 'fetch requested';
  public static readonly loginResponse = 'login response'; // TODO: this one should be dispatched by a saga
  public static readonly claimsSubmitRequested = 'claims submit requested';
  public static readonly claimsModalDismissRequested = 'dismiss work modal';

  // SagaActions: dispatched by a saga, listened by a reducer — these are Actions command changes imperatively
  public static readonly loginSuccess = 'login success';
  public static readonly loginModalOpen = 'login modal open';
  public static readonly loginModalClose = 'login modal close';
  public static readonly logoutRequested = 'logout requested';

  public static readonly fetchResponseSuccess = 'fetch response success';
  public static readonly fetchResponseError = 'fetch response error';

  public static readonly claimsSigned = 'claim signed';
  public static readonly claimsSubmitedSuccess = 'create claim success';
  public static readonly claimsSubmitting = 'submitting claims';

  public static readonly signClaimsModalShow = 'show sign claims modal';
  public static readonly signClaimsModalHide = 'hide sign claims modal';

  public static readonly updatingProfile = 'updating profile';
  public static readonly profileUpdated = 'profile updated successfully';
  public static readonly updateProfileRequested = 'profile update requested';

  public static readonly loginIdReceived = 'login ID received';
  public static readonly unrecognizedSocketMessage = 'unrecognized socket message';
  public static readonly mockLoginRequest = 'mock login server requested';

  public static readonly claimsResponse = 'claim response for signature';
  public static readonly claimIdReceived = 'request id for authorizing claim received';
  public static readonly fakeClaimSign = 'fake sign claim requested';

  public static readonly blockInfoReceived = 'block info received';

  public static readonly signTxSubmitRequested = 'sign tx submit requested';
  public static readonly signTxModalDismissRequested = 'sign tx dismiss modal received';
  public static readonly fakeTxSign = 'fake sign requested';
  public static readonly txSubmittedSuccess = 'tx submitted';
  public static readonly signTxIdReceived = 'sign tx id received';
  public static readonly signTxModalHide = 'sign tx modal hide';
  public static readonly signTxModalShow = 'sign tx modal show';
  public static readonly submittingTx = 'submitting tx';

  public static readonly fetchProfileData = 'fetch profile data';
  public static readonly profileDataFetched = 'profile data fetched';

  public static readonly payForLicenseRequested = 'pay for license';
  public static readonly licensePaid = 'license paid';

  public static readonly withdrawalRequested = 'withdrawal started';
  public static readonly withdrawalDone = 'withdrawal done';

  public static readonly noBalanceAvailable = 'no balance available';
  public static readonly transferRequested = 'transfer work requested';

  public static readonly fakeTransferSign = 'fake transfer sign requested';
  public static readonly setTransferTarget = 'transfer work target set';
  public static readonly transferIdReceived = 'transfer id to sign received';

  public static readonly transferSuccess = 'transfer success';

  public static readonly transferModalShow = 'transfer modal show';
  public static readonly transferModalHide = 'transfer modal hide';
  public static readonly transferModalDismissRequested = 'transfer modal dismiss requested';
  public static readonly transferDismissed = 'transfer work modal dismissed';
}
