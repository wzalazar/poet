import { Action } from 'redux';
import { takeEvery } from 'redux-saga'
import { put, select, take, call, race } from 'redux-saga/effects'
import { browserHistory } from 'react-router';

import { Configuration } from '../configuration';
import { Actions } from '../actions'
import { currentPublicKey } from '../selectors/session'
import { WorkOffering, Work } from '../Interfaces';

async function submitLicense(reference: string, txId: string, outputIndex: number, publicKey: string, referenceOffering: string) {
  return await fetch(Configuration.api.user + '/licenses', {
    method: 'POST',
    body: JSON.stringify({
      txId,
      outputIndex: '' + outputIndex,
      owner: publicKey,
      reference,
      referenceOffering
    })
  }).then((res: any) => res.text())
}

function* purchaseLicense(action: Action & { work: Work, offering: WorkOffering }) {
  const offeringAttributes = action.offering.attributes;
  const reference = offeringAttributes.reference;

  yield put({ type: Actions.Modals.PurchaseLicense.Show, work: action.work, offering: action.offering });

  const { purchaseLicenseModalAccept, purchaseLicenseModalCancel } = yield race({
    purchaseLicenseModalAccept: take(Actions.Modals.PurchaseLicense.Accept),
    purchaseLicenseModalCancel: take(Actions.Modals.PurchaseLicense.Cancel)
  });

  if (!purchaseLicenseModalAccept)
    return;

  yield put({ type: Actions.Modals.PurchaseLicense.Hide});

  yield put({
    type: Actions.Transactions.SignSubmitRequested,
    payload: {
      paymentAddress: offeringAttributes.paymentAddress,
      amountInSatoshis: parseFloat(offeringAttributes.pricingPriceAmount) * (offeringAttributes.pricingPriceCurrency === "BTC" ? 1e8 : 1),
      conceptOf: 'License',
      resultAction: Actions.Licenses.Success,
      resultPayload: action.offering
    }
  });

  while (true) {
    const result = yield race({
      paidLicense: take(Actions.Licenses.Success),
      noBalance: call(function* () {
        yield take(Actions.noBalanceAvailable);
        return true
      })
    });
    if (result.noBalance) {
      return;
    }
    if (result.paidLicense.payload.id !== action.offering.id) {
      continue;
    }
    const transaction = result.paidLicense.transaction;
    const outputIndex = result.paidLicense.outputIndex;
    const publicKey = yield select(currentPublicKey);
    const createdClaims = yield call(submitLicense, reference, transaction, outputIndex, publicKey, offeringAttributes.id);

    console.log(createdClaims)
    yield put({ type: Actions.Modals.SignTransaction.Hide });
    yield put({ type: Actions.Licenses.Success, resultId: createdClaims[0].id });
    yield put({ type: Actions.Modals.PurchaseLicense.ShowSuccess })

    browserHistory.push('/licenses/');

    return;
  }
}

export function purchaseLicenseSaga() {
  return function*() {
    yield takeEvery(Actions.Licenses.PurchaseRequested, purchaseLicense)
  }
}
