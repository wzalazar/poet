import { ClassTableChild, Column, ManyToOne } from 'typeorm'
import Claim from './claim'
import CreativeWork from './creativeWork'

@ClassTableChild()
export default class Offering extends Claim {

  @Column()
  offeringType: string

  @Column()
  offeringInfo: string

  @ManyToOne(type => CreativeWork, work => work.offerings)
  for: any
}
