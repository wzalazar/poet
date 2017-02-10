import {ClaimType, WORK, OFFERING, TITLE, PROFILE, LICENSE} from "../../../claim";
import work from "./work";
import profile from "./profile";
import title from "./title";
import offering from "./offering";
import license from "./license";
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

rules[WORK].push(work)
rules[PROFILE].push(profile)
rules[TITLE].push(title)
rules[OFFERING].push(offering)
rules[LICENSE].push(license)

export default rules