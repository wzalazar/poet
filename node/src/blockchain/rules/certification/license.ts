import BlockchainService from "../../domainService";
import {BlockMetadata} from "../../../events";
import {Claim, LICENSE} from "../../../claim";
import Fields from "../../fields";
import { EventType } from '../../orm/events/events';
import * as fetch from 'isomorphic-fetch'

const Reference = Fields.REFERENCE
const ReferenceOffering = Fields.REFERENCE_OFFERING
const Holder = Fields.LICENSE_HOLDER
const ProofValue = Fields.PROOF_VALUE
const ProofType = Fields.PROOF_TYPE

async function fetchTx(txId: string): Promise<any> {
  return await fetch(`https://test-insight.bitpay.com/api/tx/${txId}`)
    .then(res => res.text())
    .then(text => {
      try {
        return JSON.parse(text)
      } catch(error) {
        return null
      }
    })
}

export default {
  type: LICENSE,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    const workId = claim.attributes[Reference]
    if (!workId) {
      console.log('Received weird license with no "reference" field', claim)
      return
    }
    const work = await service.workRepository.findOne({ id: workId })
    if (!work) {
      console.log('Could not find referred work', claim)
      return
    }
    const referenceOfferingId = claim.attributes[ReferenceOffering]
    const referenceOffering = referenceOfferingId
      && await service.getOffering(referenceOfferingId)
    if (!referenceOffering) {
      console.log('Could not find referred offering')
      return
    }

    const ownerStated = claim.attributes[Fields.REFERENCE_OWNER]
    const ownerOnRecord = await service.getOwnerPublicKey(workId)

    if (ownerOnRecord && ownerStated && ownerOnRecord !== ownerStated) {
      console.log('Different owner on record')
      return
    }

    const holderId = claim.attributes[Holder]
    const holder = holderId
      && await service.profileRepository.findOneById(holderId)

    const proofType = claim.attributes[ProofType]
    let proofValue
    try {
      proofValue = JSON.parse(claim.attributes[ProofValue])
    } catch(err) {
      console.log('invalid json for proof value', claim)
      return
    }
    if (!proofType || !proofValue) {
      console.log('Missing proof information', claim)
      return
    }
    if (proofType === 'Bitcoin Transaction') {

      try {
        const tx = await fetchTx(proofValue.txId)
        if (!tx) {
          console.log('no tx found')
          return
        }
        const output = tx.vout[proofValue.outputIndex]
        if (!output) {
          console.log('no output found')
          return
        }
        const hasPaymentAddress = (address: string) => address === referenceOffering.attributes[Fields.PAYMENT_ADDRESS]
        const outputsMatching = output.scriptPubKey.addresses.filter(hasPaymentAddress)
        if (!outputsMatching.length) {
          console.log('no output with matching address found')
          return
        }
        const value = outputsMatching.reduce((prev: number, next: {value: number}) => prev - (-next.value), 0)
        if (Math.abs(value - parseFloat(referenceOffering.attributes[Fields.PAYMENT_AMOUNT])) < 1e-8) {
          console.log('mismatching amount')
          return
        }
      } catch (error) {
        console.log('unexpected error', error, error.stack)
        return
      }
    } else {
      console.log("Unknown proof type", proofType)
      return
    }
    const owner = await service.profileRepository.findOneById(ownerOnRecord)
    await service.saveEvent(claim.id, EventType.LICENSE_BOUGHT, work, holder, undefined, owner)
    await service.saveEvent(claim.id, EventType.LICENSE_SOLD, work, owner)

    const license = await service.licenseRepository.persist(service.licenseRepository.create({
      id: claim.id,
      reference: work,
      licenseHolder: holder,
      referenceOffering: referenceOffering,
      proofType: proofType,
      proofValue: proofValue,
      bitcoinTx: proofValue.txId,
      licenseEmitter: ownerOnRecord
    }))
    work.publishers = work.publishers || []
    work.publishers.push(holder)
    await service.workRepository.persist(work)
    return license
  }
}
