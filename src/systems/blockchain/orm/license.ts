import { Column, ManyToOne, Table, PrimaryColumn } from 'typeorm'
import CreativeWork from './creativeWork'
import Profile from './profile'

@Table()
export default class License {

  @PrimaryColumn()
  id: string

  @ManyToOne(type => CreativeWork, work => work.licenses, { nullable: true })
  for: CreativeWork

  @ManyToOne(type => Profile, profile => profile.licenses, { nullable: true })
  owner: Profile

  @Column({ nullable: true })
  proofType: string

  @Column({ nullable: true })
  proofValue: string
}
