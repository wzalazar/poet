import { Table, Column, PrimaryColumn, OneToMany, Index, DiscriminatorColumn, TableInheritance } from 'typeorm'
import Attribute from './attribute'
import { ClaimType } from '../../../model/claim'

@Table()
@TableInheritance("class-table")
@DiscriminatorColumn({ name: "_type", type: "string"})
export default class Claim {
  @PrimaryColumn('string')
  id: string

  @Column()
  @Index()
  publicKey: string

  @Column()
  signature: string

  @Column()
  @Index()
  type: ClaimType

  @OneToMany((type => Attribute), attribute => attribute.claim)
  attributes: Attribute[]
}
