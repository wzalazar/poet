import {
  Column, OneToMany, ManyToOne, ManyToMany, Table, PrimaryGeneratedColumn, JoinTable, OneToOne,
  JoinColumn, PrimaryColumn
} from 'typeorm'
import License from './license'
import Offering from './offering'
import Profile from './profile'
import Title from './title'

@Table()
export default class CreativeWork {

  @PrimaryColumn()
  id: string

  @OneToOne(type => Title, title => title.for, { nullable: true })
  @JoinColumn()
  title: Title

  @Column({ nullable: true })
  author: string

  @ManyToOne(type => Profile, profile => profile.ownedWorks, { nullable: true })
  @JoinColumn()
  owner: Profile

  @OneToMany(type => License, license => license.for)
  @JoinTable()
  licenses: License[]

  @OneToMany(type => Offering, offering => offering.for)
  @JoinTable()
  offerings: Offering[]

  @ManyToMany(type => Profile, profile => profile.hasLicensesFor)
  @JoinTable()
  publishers: Profile[]
}
