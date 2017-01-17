import { ClassTableChild, Column, ManyToOne, ManyToMany } from 'typeorm'
import Claim from './claim'
import CreativeWork from './creativeWork'
import Profile from './profile'

@ClassTableChild()
export default class License extends Claim {

  @ManyToOne(type => CreativeWork, work => work.licenses)
  for: CreativeWork

  @ManyToOne(type => Profile, profile => profile.licenses)
  owner: Profile

  @Column()
  proofType: string

  @Column()
  proofValue: string
}
