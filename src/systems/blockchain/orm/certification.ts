import { ClassTableChild, Column } from 'typeorm'
import Claim from './claim'

@ClassTableChild()
export default class Certification extends Claim {
  @Column()
  for: string

  @Column()
  trusted: boolean
}
