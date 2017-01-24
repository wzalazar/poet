export default class Actions {
  // ComponentActions: dispatched by a component, listened by a saga — these are more like Events
  public static readonly loginButtonClicked = 'login button clicked';
  public static readonly logoutButtonClicked = 'logout button clicked';
  public static readonly loginModalDisposeRequested = 'login modal dispose requested';
  public static readonly navbarSearchClick = 'navbar search click';
  public static readonly fetchRequest = 'fetch requested';
  public static readonly loginResponse = 'login response'; // TODO: this one should be dispatched by a saga
  public static readonly claimsSubmitRequested = 'create work requested';
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
}
