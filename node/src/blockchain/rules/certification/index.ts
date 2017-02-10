import { BlockMetadata } from '../../../events'
import {Claim, ClaimType, WORK, OFFERING, TITLE, PROFILE, LICENSE} from '../../../claim'
import BlockchainService from '../../domainService'

import work from './work'
import profile from './profile'
import title from './title'
import offering from './offering'
import license from './license'

export interface Hook {
  (service: BlockchainService, claim: Claim, info: BlockMetadata): any
}

export interface HookDescription {
  type: ClaimType
  hook: Hook
}


const rules: { [key in ClaimType]: Hook[] } = {
  'Work'        : [] as Hook[],
  'Title'       : [] as Hook[],
  'License'     : [] as Hook[],
  'Offering'    : [] as Hook[],
  'Profile'     : [] as Hook[],
  'Certificate' : [] as Hook[],
  'Revocation'  : [] as Hook[],
}

rules[WORK].push(work)
rules[PROFILE].push(profile)
rules[TITLE].push(title)
rules[OFFERING].push(offering)
rules[LICENSE].push(license)

export default rules