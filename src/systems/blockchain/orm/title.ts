import { ClassTableChild, Column, OneToOne } from 'typeorm'
import Claim from './claim'
import CreativeWork from './creativeWork'

@ClassTableChild()
export default class Title extends Claim {
  @OneToOne(type => CreativeWork, work => work.title)
  for: CreativeWork
}
