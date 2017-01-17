import { ClassTableChild, Column } from 'typeorm'
import Claim from './claim'

@ClassTableChild()
export default class Offering extends Claim {

  @Column()
  offeringType: string

  @Column()
  offeringInfo: string

  @Column()
  for: string
}
