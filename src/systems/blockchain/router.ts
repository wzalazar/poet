import BlockchainService from './service'
import * as Router from 'koa-router'
import Route from '../../helpers/route'
import { Repository } from 'typeorm'

export default class BlockchainRouter {
  service: BlockchainService

  constructor(service: BlockchainService) {
    this.service = service
  }

  async addRoutes(router: Router) {
    await this.service.start()

    function route<T>(repository: Repository<T>, resourcePath: string) {
      const route = new Route<T>(repository, resourcePath)
      route.addRoutes(router)
    }

    // Placeholder for /node endpoint
    router.get('/node', async (ctx) => {
      ctx.body = JSON.stringify({ peers: 4, status: "synced" })
    })

    try {
      route(this.service.workRepository   , 'works'   )
      route(this.service.blockRepository  , 'blocks'  )
      route(this.service.profileRepository, 'profiles')
      route(this.service.claimRepository  , 'claims'  )
      route(this.service.licenseRepository, 'licenses')
    } catch (error) {
      console.log('Unable to setup route', error, error.stack)
    }
  }
}