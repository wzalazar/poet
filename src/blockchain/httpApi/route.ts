import * as TypeORM from 'typeorm'
import * as Router from 'koa-router'
import * as Koa from 'koa'
import Context = Koa.Context
import { QueryBuilder } from 'typeorm'

const OFFSET = 'offset'
const LIMIT = 'limit'

export interface QueryOptions {
  offset: number
  limit: number
}

export default class Route<T> {
  protected idKey: string
  protected repository: TypeORM.Repository<T>
  protected resourcePath: string

  constructor(repository: TypeORM.Repository<T>, resourcePath: string, idKey?: string) {
    this.resourcePath = resourcePath
    this.repository = repository
    this.idKey = idKey || 'id'
  }

  async getItem(id: string) {
    return await this.repository.findOne({ [this.idKey]: id })
  }

  async renderCollection(items: T[]) {
    return JSON.stringify(await Promise.all(items.map((item) => this.prepareItem(item))))
  }

  async renderItem(item: T) {
    return JSON.stringify(await this.prepareItem(item))
  }

  async prepareItem(item: T) {
    // TODO: Assert JSON.parse(JSON.stringify(item))) deep equals item
    return Promise.resolve(item)
  }

  async getCollection(opts: QueryOptions) {
    let queryBuilder = this.repository
      .createQueryBuilder('item') // first argument is an alias. Alias is what you are selecting - photos. You must specify it.
      .setFirstResult(opts.offset)
      .setMaxResults(opts.limit)

    queryBuilder = this.ownFilter(queryBuilder, opts)

    return await queryBuilder.getMany()
  }

  ownFilter(queryBuilder: QueryBuilder<T>, opts: QueryOptions): QueryBuilder<T> {
    return queryBuilder
  }

  getParamOpts(ctx: Context): QueryOptions {
    return {
      offset: ctx.request.query[OFFSET],
      limit: ctx.request.query[LIMIT]
    }
  }

  addRoutes(router: Router) {
    router.get('/' + this.resourcePath, async (ctx) => {
      const opts = this.getParamOpts(ctx)
      const col = await this.getCollection(opts)
      console.log('Collection for', this.resourcePath, await this.renderCollection(col))
      ctx.body = await this.renderCollection(col)
    })
    router.get('/' + this.resourcePath + '/:id', async (ctx) => {
      const item = await this.getItem(ctx.params.id)
      console.log('Item for', this.resourcePath + '/' + ctx.params.id, item)
      ctx.body = await this.renderItem(item)
    })
  }
}
