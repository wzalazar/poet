import * as TypeORM from 'typeorm'
import * as Router from 'koa-router'

export class JSONStringifiable {
  content: any
  constructor(content: any) {
    this.content = content
  }
}

export default class Route<T> {
  private idKey: string
  private repository: TypeORM.Repository<T>
  private resourcePath: string

  constructor(repository: TypeORM.Repository<T>, resourcePath: string, idKey?: string) {
    this.resourcePath = resourcePath
    this.repository = repository
    this.idKey = idKey || 'id'
  }

  renderCollection(items: T[]) {
    return JSON.stringify(items.map(this.renderItem.bind(this)))
  }

  renderItem(item: T) {
    return JSON.stringify(this.prepareItem(item).content)
  }

  prepareItem(item: T): JSONStringifiable {
    // TODO: Assert JSON.parse(JSON.stringify(item))) deep equals item
    return new JSONStringifiable(item)
  }

  addRoutes(router: Router) {
    router.get('/' + this.resourcePath, async (ctx) => {
      ctx.body = this.renderCollection(await this.repository.find())
    })
    router.get('/' + this.resourcePath + '/:id', async (ctx) => {
      ctx.body = this.renderItem(await this.repository.findOne({ [this.idKey]: ctx.params.id }))
    })
  }
}
