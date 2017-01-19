import { Column, Table, PrimaryColumn, ManyToOne, OneToOne } from 'typeorm'
import Profile from './profile'
import Work from './work'

@Table()
export default class Title {

  @PrimaryColumn()
  id: string

  @OneToOne(type => Work, work => work.title)
  reference: Work

  @ManyToOne(type => Profile, profile => profile.ownedWorks)
  owner: Profile
}
