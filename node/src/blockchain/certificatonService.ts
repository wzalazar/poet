import {Claim as PureClaim} from "../claim";
import {BlockMetadata} from "../events";
import { CertificationRules } from "./rules/certification";
import DomainService from "./domainService";

export default class CertificationService {

  private domainService: DomainService;

  constructor(domainService: DomainService) {
    this.domainService = domainService
  }

  async notaryApproval(claim: PureClaim) {
    // TODO: Validate signature
    // TODO: Validate public key is trusted
    // TODO: Notary repository
    return true
  }

  async certifyClaim(reference: PureClaim, txInfo: BlockMetadata) {
    return await Promise.all(CertificationRules[reference.type].map(
      rule => rule.hook(this.domainService, reference, txInfo)
    ))
  }
}