import { ClassTableChild, ManyToMany, OneToMany } from 'typeorm'
import Claim from './claim'
import License from './license'
import CreativeWork from './creativeWork'

@ClassTableChild()
export default class Profile extends Claim {

  @OneToMany(type => License, license => license.owner)
  licenses: any[]

  @OneToMany(type => CreativeWork, work => work.author)
  authoredWorks: any[]

  @ManyToMany(type => CreativeWork, work => work.publishers)
  hasLicensesFor: any[]

  @OneToMany(type => CreativeWork, work => work.owner)
  ownedWorks: any[]
}
