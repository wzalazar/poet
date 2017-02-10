import {ClaimType, CERTIFICATE, REVOCATION} from "../../../claim";
import {Hook, HookDescription} from "../hook";

const rules: { [key in ClaimType]: HookDescription[] } = {
  'Work'        : [] as HookDescription[],
  'Title'       : [] as HookDescription[],
  'License'     : [] as HookDescription[],
  'Offering'    : [] as HookDescription[],
  'Profile'     : [] as HookDescription[],
  'Certificate' : [] as HookDescription[],
  'Revocation'  : [] as HookDescription[],
}

import { default as certificateRule } from './certificate'
import { default as revocationRule } from './revocation'

rules[CERTIFICATE].push(certificateRule)
rules[REVOCATION].push(revocationRule)

export default rules

