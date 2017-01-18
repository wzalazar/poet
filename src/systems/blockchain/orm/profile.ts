import { ManyToMany, OneToMany, JoinTable, Column, PrimaryGeneratedColumn, Table, PrimaryColumn } from 'typeorm'
import License from './license'
import CreativeWork from './creativeWork'

@Table()
export default class Profile {

  @PrimaryColumn()
  id: string

  @OneToMany(type => License, license => license.owner)
  @JoinTable()
  licenses: CreativeWork[]

  @ManyToMany(type => CreativeWork, work => work.publishers)
  hasLicensesFor: CreativeWork[]

  @OneToMany(type => CreativeWork, work => work.author)
  authoredWorks: CreativeWork[]

  @OneToMany(type => CreativeWork, work => work.author)
  ownedWorks: CreativeWork[]
}
