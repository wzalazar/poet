import { Table, Column, PrimaryColumn, ManyToMany, Index } from 'typeorm'

import Claim from './claim'

@Table()
export default class Block {
  @PrimaryColumn('id')
  id: string

  @ManyToMany(type => Claim)
  claims: Claim[]
}
