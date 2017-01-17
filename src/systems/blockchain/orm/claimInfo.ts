import { Table, PrimaryColumn, OneToOne, JoinColumn, Column } from 'typeorm'
import Claim from './claim'

@Table()
export default class ClaimInfo {
  @PrimaryColumn('int', { generated: true })
  _id: number

  @Column()
  id: string

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
}
