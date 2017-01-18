import { Table, Column, PrimaryColumn, ManyToMany, Index, JoinTable } from 'typeorm'

import Claim from './claim'

@Table()
export default class Block {
  @PrimaryColumn({ length: 64, type: 'string' })
  id: string

  @ManyToMany(type => Claim, {
    cascadeInsert: true,
    cascadeUpdate: true,
    cascadeRemove: true
  })
  @JoinTable()
  claims: Claim[]
}
