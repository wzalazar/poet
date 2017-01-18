import { Table, Column, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import Claim from './claim'

@Table()
export default class Attribute {
  @PrimaryGeneratedColumn()
  _id: number

  @ManyToOne(type => Claim, claim => claim.attributes)
  claim: Claim

  @Column()
  @Index()
  key: string

  @Column()
  value: string
}
