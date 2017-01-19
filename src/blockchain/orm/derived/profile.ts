import { ManyToMany, OneToMany, JoinTable, Column, Table, PrimaryColumn } from 'typeorm'
import License from './license'
import CreativeWork from './work'

@Table()
export default class Profile {

  @PrimaryColumn()
  id: string

  @Column()
  claim: string

  @OneToMany(type => License, license => license.licenseHolder)
  @JoinTable()
  licenses: CreativeWork[]

  @ManyToMany(type => CreativeWork, work => work.publishers)
  hasLicensesFor: CreativeWork[]

  @OneToMany(type => CreativeWork, work => work.author)
  @JoinTable()
  authoredWorks: CreativeWork[]

  @OneToMany(type => CreativeWork, work => work.owner)
  @JoinTable()
  ownedWorks: CreativeWork[]
}
