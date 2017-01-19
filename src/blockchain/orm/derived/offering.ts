import { Column, ManyToOne, Table, PrimaryColumn, OneToMany } from 'typeorm'
import CreativeWork from './work'
import License from './license'

@Table()
export default class Offering {

  @PrimaryColumn()
  id: string

  @ManyToOne(type => CreativeWork, work => work.offerings)
  reference: CreativeWork

  @OneToMany(type => License, license => license.referenceOffering)
  licenses: License[]

  @Column({ nullable: true })
  offeringType: string

  @Column({ nullable: true })
  offeringInfo: string
}
