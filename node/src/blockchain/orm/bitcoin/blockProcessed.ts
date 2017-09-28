import { Column, Index, PrimaryGeneratedColumn, Table } from 'typeorm'

@Table()
export default class BlockProcessed {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  hash: string

  @Column({ nullable: false })
  parentHash: string

  @Column({ nullable: true })
  @Index()
  height: number

  @Column({ nullable: true })
  transactionCount: number

  @Column({ nullable: true })
  timeProcessed: number

  @Column({ nullable: true })
  errorMessage: string

  @Column({ nullable: true, default: false })
  orphaned: boolean
}
