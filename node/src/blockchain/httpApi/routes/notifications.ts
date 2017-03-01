import 'reflect-metadata';
import * as Koa from 'koa';
import BlockchainService from '../../domainService';
import Route, { QueryOptions } from '../route';
import { QueryBuilder } from 'typeorm';
import Event from '../../orm/events/events';
import Router = require('koa-router')
import Context = Koa.Context

interface EventQueryOpts extends QueryOptions {
  profile?: string
  work?: string
}

const PROFILE = 'profile'
const WORK = 'work'

export default class NotificationsRoute extends Route<Event> {
  service: BlockchainService

  constructor(service: BlockchainService) {
    super(service.eventRepository, 'events')
    this.service = service
  }

  async prepareItem(item: Event): Promise<any> {
    this.service.notificationRepository.findOne({ event: item.id })
  }

  addRoutes(router: Router): any {
    router.get('/notifications/:userId', async (ctx: any) => {
      const notificationQuery = await this.service.eventRepository.createQueryBuilder('item')
        .where('item.actorId=:userId', { userId: ctx.params.userId })
        .orderBy('item.timestamp', 'DESC')
        .getMany()
      const reads = await this.service.notificationRepository.createQueryBuilder('item')
        .where('item.event IN :ids', { ids: notificationQuery.map(item => item.id) })
        .getMany()
      const notifications = {} as { [id: string]: Event }
      for (let notification of notificationQuery) {
        notifications[notification.id] = notification
      }
      for (let read of reads) {
        (notifications[read.event as any] as any).read = true
      }
      const result = []
      for (let notification of notificationQuery) {
        result.push(notification)
      }
      return result
    })
    router.patch('/notifications/:userId', async (ctx: any) => {
      const ids = JSON.parse(ctx.body) as ReadonlyArray<any>
      const notifications = ids.map(id => this.service.notificationRepository.create({
          event: { id: id },
          read: true
        })
      )
      const query = await this.service.notificationRepository.persist(notifications)
      return query.length
    })
  }
}
