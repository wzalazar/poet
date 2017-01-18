import { ClassTableChild, Column, ManyToOne, Table, PrimaryGeneratedColumn, JoinTable, PrimaryColumn } from 'typeorm'
import Claim from './claim'
import CreativeWork from './creativeWork'

@Table()
export default class Offering {

  @PrimaryColumn()
  id: string

  @Column({ nullable: true })
  offeringType: string

  @Column({ nullable: true })
  offeringInfo: string

  @ManyToOne(type => CreativeWork, work => work.offerings)
  for: any
}
