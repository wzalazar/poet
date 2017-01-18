import { ClassTableChild, Column, OneToOne, OneToMany, ManyToOne, ManyToMany } from 'typeorm'

import Claim from './claim'
import Title from './title'
import License from './license'
import Offering from './offering'
import Profile from './profile'

@ClassTableChild()
export default class CreativeWork extends Claim {

  @Column()
  timestamp: number

  @OneToOne(type => Title, title => title.for)
  title: Title

  @OneToMany(type => License, license => license.for)
  licenses: License[]

  @OneToMany(type => Offering, offering => offering.for)
  offerings: Offering[]

  @ManyToOne(type => Profile, profile => profile.authoredWorks)
  author: Profile

  @ManyToOne(type => Profile, profile => profile.ownedWorks)
  owner: Profile

  @ManyToMany(type => Profile, profile => profile.hasLicensesFor)
  publishers: Profile
}
