import { Table, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm'
import Block from './block'

@Table()
export default class BlockInfo {
  @PrimaryColumn('int', { generated: true })
  _id: number

  @OneToOne(type => Block)
  @JoinColumn()
  block: Block;
}
