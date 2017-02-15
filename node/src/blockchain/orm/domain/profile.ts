import { ManyToMany, OneToMany, JoinTable, Column, Table, PrimaryColumn } from 'typeorm'
import License from './license'
import Work from './work'

@Table()
export default class Profile {

  @PrimaryColumn()
  id: string

  @Column()
  claim: string

  @OneToMany(type => License, license => license.licenseHolder)
  @JoinTable()
  licenses: Work[]

  @ManyToMany(type => Work, work => work.publishers)
  hasLicensesFor: Work[]

  @ManyToMany(type => License, license => license.licenseEmitter)
  licensesEmitted: License[]

  @OneToMany(type => Work, work => work.author)
  @JoinTable()
  authoredWorks: Work[]

  @OneToMany(type => Work, work => work.owner)
  @JoinTable()
  ownedWorks: Work[]

  attributes: { [key: string]: string }
}
