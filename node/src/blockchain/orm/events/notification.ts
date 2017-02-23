import { Table, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinTable } from 'typeorm';
import Event from './events';

@Table()
export default class NotificationRead {

  @PrimaryGeneratedColumn()
  id: string

  @ManyToOne(type => Event)
  @JoinTable()
  event: Event
}
