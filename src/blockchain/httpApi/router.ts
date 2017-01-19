import * as Router from 'koa-router'
import { Repository } from 'typeorm'

import BlockchainService from '../service'
import Route from './route'
import WorkRoute from './routes/work'
import getConnection from '../connection'
import getBuilder from '../../serialization/builder'

export default class BlockchainRouter {
  service: BlockchainService

  constructor(service: BlockchainService) {
    this.service = service
  }

  async addRoutes(router: Router) {
    await this.service.start(getConnection, getBuilder)

    function route<T>(repository: Repository<T>, resourcePath: string) {
      const route = new Route<T>(repository, resourcePath)
      route.addRoutes(router)
    }

    // Placeholder for /node endpoint
    router.get('/node', async (ctx) => {
      ctx.body = JSON.stringify({ peers: 4, status: "synced" })
    })

    try {
      new WorkRoute(this.service).addRoutes(router)
      route(this.service.blockRepository  , 'blocks'  )
      route(this.service.profileRepository, 'profiles')
      route(this.service.claimRepository  , 'claims'  )
    } catch (error) {
      console.log('Unable to setup route', error, error.stack)
    }
  }
}