export default class Actions {
  // ComponentActions: dispatched by a component, listened by a saga — these are more like Events
  public static readonly loginButtonClicked = 'login button clicked';
  public static readonly logoutButtonClicked = 'logout button clicked';
  public static readonly loginModalDisposeRequested = 'login modal dispose requested';
  public static readonly navbarSearchClick = 'navbar search click';
  public static readonly fetchRequest = 'fetch requested';
  public static readonly loginResponse = 'login response'; // TODO: this one should be dispatched by a saga

  // SagaActions: dispatched by a saga, listened by a reducer — these are Actions command changes imperatively
  public static readonly loginSuccess = 'login success';
  public static readonly loginModalOpen = 'login modal open';
  public static readonly loginModalClose = 'login modal close';
  public static readonly logoutRequested = 'logout requested';

  public static readonly fetchResponseSuccess = 'fetch response success';
  public static readonly fetchResponseError = 'fetch response error';
}
