import {
  Table, Column, PrimaryColumn, OneToMany, Index, DiscriminatorColumn, TableInheritance,
  JoinTable
} from 'typeorm'
import Attribute from './attribute'
import { ClaimType } from '../../../model/claim'

@Table()
@TableInheritance("class-table")
@DiscriminatorColumn({ name: "_class", type: "string"})
export default class Claim {
  @PrimaryColumn()
  id: string

  @Column()
  publicKey: string

  @Column()
  signature: string

  @Column()
  type: ClaimType

  @OneToMany((type => Attribute), attribute => attribute.claim, {
    cascadeInsert: true,
    cascadeUpdate: true,
    cascadeRemove: true
  })
  @JoinTable()
  attributes: Attribute[]
}
