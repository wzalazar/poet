import { Table, PrimaryColumn, Column, Index } from 'typeorm'

@Table()
export default class BlockInfo {
  @PrimaryColumn('number', { generated: true })
  _id: number

  @Index()
  @Column()
  id: string

  @Column()
  height: number

  @Column()
  timestamp: number

  @Column()
  bitcoinHeight: number

  @Column()
  bitcoinHash: string

  @Column()
  transactionOrder: number

  @Column()
  transactionHash: string

  @Column()
  outputIndex: number

  @Column()
  @Index()
  torrentHash: string
}
