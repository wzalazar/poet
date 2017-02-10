import {ClaimType, CERTIFICATE, REVOCATION} from "../../../claim";
import {Hook} from "../hook";

const rules: { [key in ClaimType]: Hook[] } = {
  'Work'        : [] as Hook[],
  'Title'       : [] as Hook[],
  'License'     : [] as Hook[],
  'Offering'    : [] as Hook[],
  'Profile'     : [] as Hook[],
  'Certificate' : [] as Hook[],
  'Revocation'  : [] as Hook[],
}

import { default as certificateRule } from './certificate'
import { default as revocationRule } from './revocation'

rules[CERTIFICATE].push(certificateRule)
rules[REVOCATION].push(revocationRule)

export default rules

