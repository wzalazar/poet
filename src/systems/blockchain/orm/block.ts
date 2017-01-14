import { Table, Column, PrimaryColumn, ManyToMany, Index } from 'typeorm'

import Claim from './claim'

@Table()
export default class Block {
  @PrimaryColumn('int', { generated: true })
  _id: number

  @Column()
  @Index()
  id: string

  @ManyToMany(type => Claim)
  claims: Claim[]
}
