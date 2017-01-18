import { ClassTableChild, Column, OneToOne, PrimaryGeneratedColumn, Table, PrimaryColumn } from 'typeorm'
import Claim from './claim'
import CreativeWork from './creativeWork'

@Table()
export default class Title {

  @PrimaryColumn()
  id: string

  @OneToOne(type => CreativeWork, work => work.title)
  for: any
}
