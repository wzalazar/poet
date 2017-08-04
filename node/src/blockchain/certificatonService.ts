import { Claim, verifies, doubleSha } from 'poet-js'

import { BlockMetadata } from '../events'
import { CertificationRules } from './rules/certification'
import { BlockchainService } from './domainService'

export class CertificationService {

  private domainService: BlockchainService;

  constructor(domainService: BlockchainService) {
    this.domainService = domainService
    this.notaries = [
      '031c26b8b364e2970f3cefa458217c9d71e945576930509b48b7a9c44a88ef7464'
    ]
  }

  async notaryApproval(claim: Claim) {
    // TODO: Notary repository
    if (!this.notaries.includes(claim.publicKey)) {
      return false
    }
    const encoded = new Buffer(ClaimBuilder.getEncodedForSigning(claim), 'hex')
    if (!verifies(doubleSha, encoded, claim.signature, claim.publicKey)) {
      return false
    }
    return true
  }

  async certifyClaim(reference: Claim, txInfo: BlockMetadata) {
    return await Promise.all(CertificationRules[reference.type].map(
      rule => rule.hook(this.domainService, reference, txInfo)
    ))
  }
}
