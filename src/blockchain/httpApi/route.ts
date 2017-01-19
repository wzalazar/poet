import * as TypeORM from 'typeorm'
import * as Router from 'koa-router'

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

  async getCollection() {
    return await this.repository.find()
  }

  addRoutes(router: Router) {
    router.get('/' + this.resourcePath, async (ctx) => {
      const col = await this.getCollection()
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
