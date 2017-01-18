import { Table, Column, PrimaryGeneratedColumn } from 'typeorm'

@Table()
export default class ClaimInfo {
  @PrimaryGeneratedColumn()
  _id: number

  @Column()
  id: string

  @Column({ nullable: true })
  timestamp?: number

  @Column({ nullable: true })
  bitcoinHeight?: number

  @Column({ nullable: true })
  bitcoinHash?: string

  @Column({ nullable: true })
  poetBlockHeight?: number

  @Column({ nullable: true })
  poetBlockHash?: string

  @Column({ nullable: true })
  transactionOrder?: string

  @Column()
  transactionHash: string

  @Column()
  outputIndex: number

  @Column()
  torrentHash: string

  @Column({ nullable: true })
  poetOrder?: number
}
