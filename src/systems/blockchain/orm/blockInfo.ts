import { Table, PrimaryColumn, Column } from 'typeorm'

@Table()
export default class BlockInfo {
  @PrimaryColumn('int', { generated: true })
  _id: number

  @Column()
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
