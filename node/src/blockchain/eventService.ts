import { DatabaseConnection } from 'typeorm/driver/DatabaseConnection';
import Event from './orm/events/events';
import { Repository, Connection } from "typeorm";

export class EventService {
  private db: Connection;

  constructor(db: Connection) {
    this.db = db
  }

  get eventRepository(): Repository<Event> {
    return this.db.getRepository(Event)
  }
}