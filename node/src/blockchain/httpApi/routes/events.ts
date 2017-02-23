import 'reflect-metadata';
import * as Koa from 'koa';
import BlockchainService from '../../domainService';
import Route, { QueryOptions } from '../route';
import OfferingRoute from './offerings';
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

export default class EventRoute extends Route<Event> {
  service: BlockchainService
  offerings: OfferingRoute

  ownFilter(queryBuilder: QueryBuilder<Event>, opts: EventQueryOpts): QueryBuilder<Event> {
    if (opts.profile) {
      queryBuilder.andWhere('actorId=:profile', opts)
    } else if (opts.work) {
      queryBuilder.andWhere('workId=:work', opts)
    } else {
      throw new Error('Invalid parameter: must supply actor or work id')
    }
    queryBuilder.orderBy('timestamp', 'DESC')
    return queryBuilder
  }

  getParamOpts(ctx: Context): EventQueryOpts {
    const result = super.getParamOpts(ctx)
    return Object.assign(result, {
      profile: ctx.request.query[PROFILE],
      work: ctx.request.query[WORK],
    }) as EventQueryOpts
  }
}
