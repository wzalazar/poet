import { CERTIFICATE, ClaimType, LICENSE, OFFERING, REVOCATION, TITLE, WORK } from '../../../claim'
import { HookDescription } from '../hook'
import { default as certificateRule } from './certificate'
import { default as revocationRule } from './revocation'

import { default as licenseRule } from './license'
import { default as offeringRule } from './offering'
import { default as titleRule } from './title'
import { default as workRule } from './work'

const rules: { [key in ClaimType]: HookDescription[] } = {
  'Work'        : [] as HookDescription[],
  'Title'       : [] as HookDescription[],
  'License'     : [] as HookDescription[],
  'Offering'    : [] as HookDescription[],
  'Profile'     : [] as HookDescription[],
  'Certificate' : [] as HookDescription[],
  'Revocation'  : [] as HookDescription[],
}

rules[CERTIFICATE].push(certificateRule)
rules[REVOCATION].push(revocationRule)
rules[LICENSE].push(licenseRule)
rules[OFFERING].push(offeringRule)
rules[TITLE].push(titleRule)
rules[WORK].push(workRule)

export default rules
