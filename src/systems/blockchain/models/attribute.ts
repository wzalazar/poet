import { Table, PrimaryColumn, Column, Index, ManyToOne } from 'typeorm'

import Claim from './claim'

@Table()
export default class Attribute {
  @PrimaryColumn('int', { generated: true })
  _id: number

  @ManyToOne(type => Claim, claim => claim.attributes)
  claim: Claim

  @Column()
  @Index()
  key: string

  @Column()
  value: string
}
