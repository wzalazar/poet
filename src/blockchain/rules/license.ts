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
      ? await service.offeringRepository.findOneById(referenceOfferingId)
      : null
    const holderId = claim.attributes[Holder]
    const holder = holderId
      ? await service.profileRepository.findOneById(holderId)
      : null
    const license = await service.licenseRepository.persist(service.licenseRepository.create({
      id: claim.id,
      reference: work,
      licenseHolder: holder,
      referenceOffering: referenceOffering,
      proofType: claim.attributes[ProofType],
      proofValue: claim.attributes[ProofValue]
    }))
    return license
  }
}
