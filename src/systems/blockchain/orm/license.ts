import { ClassTableChild, Column } from 'typeorm'
import Claim from './claim'

@ClassTableChild()
export default class License extends Claim {

  @Column()
  for: string

  @Column()
  owner: string

  @Column()
  proofType: string

  @Column()
  proofValue: string
}
