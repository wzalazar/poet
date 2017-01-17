import { ClassTableChild, Column } from 'typeorm'

import Claim from './claim'

@ClassTableChild()
export default class CreativeWork extends Claim {

  @Column()
  timestamp: number
}
