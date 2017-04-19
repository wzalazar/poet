import { Table, Column, PrimaryColumn, OneToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm'
import Attribute from './attribute'
import { ClaimType } from '../../claim'

@Table()
export default class ClaimLink {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  from: string

  @Column()
  to: string
}
