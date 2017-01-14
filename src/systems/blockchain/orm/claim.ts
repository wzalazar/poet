import { Table, Column, PrimaryColumn, OneToMany, Index } from 'typeorm'
import Attribute from './attribute'

@Table()
export default class Claim {
  @PrimaryColumn('int', { generated: true })
  _id: number

  @Column()
  @Index()
  id: string

  @Column()
  @Index()
  publicKey: string

  @Column()
  signature: string

  @Column()
  type: string

  @OneToMany((type => Attribute), attribute => attribute.claim)
  attributes: Attribute[]
}
