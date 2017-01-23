export default class Actions {
  // ComponentActions: dispatched by a component, listened by a saga — these are more like Events
  public static readonly loginButtonClicked = 'login button clicked';
  public static readonly logoutButtonClicked = 'logout button clicked';
  public static readonly loginModalDisposeRequested = 'login modal dispose requested';
  public static readonly navbarSearchClick = 'navbar search click';
  public static readonly fetchRequest = 'fetch requested';
  public static readonly loginResponse = 'login response'; // TODO: this one should be dispatched by a saga
  public static readonly createWorkRequested = 'create work requested';
  public static readonly workModalDismissRequested = 'dismiss work modal';

  // SagaActions: dispatched by a saga, listened by a reducer — these are Actions command changes imperatively
  public static readonly loginSuccess = 'login success';
  public static readonly loginModalOpen = 'login modal open';
  public static readonly loginModalClose = 'login modal close';
  public static readonly logoutRequested = 'logout requested';

  public static readonly fetchResponseSuccess = 'fetch response success';
  public static readonly fetchResponseError = 'fetch response error';

  public static readonly createWorkSigned = 'work signed';
  public static readonly createWorkSuccess = 'create work success';
  public static readonly submittingWork = 'submitting work';

  public static readonly workModalShow = 'show create work modal';
  public static readonly workModalHide = 'hide work modal';

  public static readonly updatingProfile = 'updating profile';
  public static readonly profileUpdated = 'profile updated successfully';
  public static readonly updateProfileRequested = 'profile update requested';
}
