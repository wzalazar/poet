import { ClaimType } from "../../claim";
import { Hook } from "./hook";
import BlockchainService from "../domainService";

class HookSystem {
  service: BlockchainService

  constructor(service: BlockchainService) {
    this.service = service
  }

  hooks: { [key in ClaimType]: Hook[] } = {
    'Work'        : [] as Hook[],
    'Title'       : [] as Hook[],
    'License'     : [] as Hook[],
    'Offering'    : [] as Hook[],
    'Profile'     : [] as Hook[],
    'Certificate' : [] as Hook[],
    'Revocation'  : [] as Hook[],
  }
}