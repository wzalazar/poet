export namespace Actions {
  export const navbarSearchClick = 'navbar search click';
  export const navbarSearchChange = 'navbar search change';
  export const fetchRequest = 'fetch requested';

  export const fetchResponseSuccess = 'fetch response success';
  export const fetchResponseError = 'fetch response error';

  export const updatingProfile = 'updating profile';
  export const profileUpdated = 'profile updated successfully';
  export const updateProfileRequested = 'profile update requested';

  export const unrecognizedSocketMessage = 'unrecognized socket message';

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

  export namespace Session {
    export const MockLoginRequest = 'mock login server requested';
    export const LoginButtonClicked = 'login button clicked';
    export const LogoutButtonClicked = 'logout button clicked';
    export const LoginResponse = 'login response';
    export const LoginSuccess = 'login success';
    export const LogoutRequested = 'logout requested';
    export const LoginIdReceived = 'login ID received';
  }

  export namespace Transfer {
    export const TransferRequested = 'transfer work requested';
    export const TransferIdReceived = 'transfer id to sign received';
    export const FakeTransferSign = 'fake transfer sign requested';
    export const SetTransferTarget = 'transfer work target set';
    export const Success = 'transfer success';
  }

  export namespace Claims {
    export const FakeSign = 'fake sign claim requested';
    export const Response = 'claim response for signature';
    export const IdReceived = 'request id for authorizing claim received';
    export const Signed = 'claim signed';
    export const SubmitRequested = 'claims submit requested';
    export const Submitting = 'submitting claims';
    export const SubmittedSuccess = 'create claim success';
  }

  export namespace Modals {
    export namespace Login {
      export const Show = 'login modal open';
      export const Hide = 'login modal close';
    }
    export namespace PurchaseLicense {
      export const Show = 'purchase license modal show';
      export const Accept = 'purchase license modal accept';
      export const Cancel = 'purchase license modal cancel';
    }
    export namespace Transfer {
      export const Show = 'transfer modal show';
      export const Hide = 'transfer modal hide';
      export const DismissRequested = 'transfer modal dismiss requested';
      export const Dismissed = 'transfer work modal dismissed';
    }
    export namespace SignClaims {
      export const Show = 'show sign claims modal';
      export const Hide = 'hide sign claims modal';
      export const DismissRequested = 'dismiss work modal';
    }
  }
}