import { Table, Column, PrimaryColumn, OneToMany, JoinTable } from 'typeorm'
import Attribute from './attribute'
import { ClaimType } from '../../claim'

@Table()
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
