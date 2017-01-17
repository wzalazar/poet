import { ClassTableChild } from 'typeorm'
import Claim from './claim'

@ClassTableChild()
export default class Offering extends Claim {
}
