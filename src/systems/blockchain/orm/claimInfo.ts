import { Table, PrimaryColumn, Column } from 'typeorm'

@Table()
export default class ClaimInfo {
  @PrimaryColumn('string')
  id: string

  @Column()
  timestamp: number

  @Column()
  bitcoinHeight: number

  @Column()
  bitcoinHash: string

  @Column()
  poetBlockHeight: number

  @Column()
  poetBlockHash: string

  @Column()
  transactionOrder: string

  @Column()
  transactionHash: string

  @Column()
  outputIndex: number

  @Column()
  torrentHash: string

  @Column()
  claimOrder: number
}
