import BlockchainService from '../service'
import { BlockMetadata } from '../../events'
import { Claim, LICENSE } from '../../claim'
import Fields from '../fields'
import License from '../orm/derived/license'

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
    /**
     * TODO: Actually validate payment
    if (proofType === 'Bitcoin Transaction') {
      const tx = await fetchTx(proofValue.txId)
      if (!tx) {
        console.log('no tx found')
        return
      }
      const output = tx.vout[proofValue.outputNumber]
      if (!output) {
        console.log('no output found')
      }
      if (output.addresses.filter((address: string) => address === referenceOffering.attributes[Fields.PAYMENT_ADDRESS])) {
      }
    } else {
      console.log("Unknown proof type", proofType)
      return
    }
     */
    return service.licenseRepository.persist(service.licenseRepository.create({
      id: claim.id,
      reference: work,
      licenseHolder: holder,
      referenceOffering: referenceOffering,
      proofType: proofType,
      proofValue: proofValue
    }))
  }
}