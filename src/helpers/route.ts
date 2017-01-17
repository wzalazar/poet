import * as TypeORM from 'typeorm'
import * as Router from 'koa-router'

export class JSONStringifiable {
  content: any
  constructor(content: any) {
    this.content = content
  }
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
    return JSON.stringify(items.map(async (item) => (await this.prepareItem(item)).content))
  }

  async renderItem(item: T) {
    return JSON.stringify((await this.prepareItem(item)).content)
  }

  async prepareItem(item: T) {
    // TODO: Assert JSON.parse(JSON.stringify(item))) deep equals item
    return new JSONStringifiable(item)
  }

  async getCollection() {
    return await this.repository.find()
  }

  addRoutes(router: Router) {
    router.get('/' + this.resourcePath, async (ctx) => {
      ctx.body = this.renderCollection(await this.getCollection())
    })
    router.get('/' + this.resourcePath + '/:id', async (ctx) => {
      ctx.body = this.renderItem(await this.getItem(ctx.params.id))
    })
  }
}
