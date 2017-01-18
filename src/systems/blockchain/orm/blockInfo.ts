import { Table, Column, Index, PrimaryGeneratedColumn } from 'typeorm'

@Table()
export default class BlockInfo {
  @PrimaryGeneratedColumn()
  _id: number

  @Index()
  @Column()
  hash: string

  @Index()
  @Column()
  torrentHash: string

  @Column({ nullable: true })
  height?: number

  @Column({ nullable: true })
  timestamp?: number

  @Column({ nullable: true })
  bitcoinHeight?: number

  @Column({ nullable: true })
  bitcoinHash?: string

  @Column({ nullable: true })
  transactionOrder?: number

  @Column({ nullable: true })
  transactionHash: string

  @Column({ nullable: true })
  outputIndex: number
}
