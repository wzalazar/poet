import { Table, PrimaryColumn, Column } from 'typeorm'

@Table()
export default class BlockInfo {
  @PrimaryColumn('string')
  id: string

  @Column()
  timestamp: number

  @Column()
  poetHeight: number

  @Column()
  bitcoinHeight: number

  @Column()
  bitcoinHash: string
}
