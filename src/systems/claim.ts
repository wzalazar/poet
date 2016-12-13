import { PoetBlock, Claim } from '../model/claim'
import * as IORedis from 'ioredis'
import { ClaimCreator } from './creator'

import { default as Builders } from '../model/loaders'

export default class DownloadSystem {
  redis: IORedis.Redis
  creator: ClaimCreator

  constructor(creator: ClaimCreator) {
    this.redis = new IORedis()
    this.creator = creator
  }

  makeBlockId(id: string) {
    return 'block-' + id
  }

  makeClaimId(id: string) {
    return 'claim-' + id
  }

  makeTitleFor(id: string) {
    return 'title-' + id
  }

  makePublicKeyKey(id: string) {
    return 'pubkey-' + id
  }

  async getBlock(id: string) {
    const block = await this.redis.get(this.makeBlockId(id))
    return this.creator.serializedToBlock(block)
  }

  async getClaim(id: string) {
    const claim = await this.redis.get(this.makeClaimId(id))
    return this.creator.serializedToClaim(claim)
  }

  async storeClaim(claim) {
    return await this.redis.set(
      this.makeClaimId(claim.id),
      this.creator.serializeForSave(claim)
    )
  }

  async getTitleFor(claimId) {
    const id = await this.redis.get(
      this.makeTitleFor(claimId)
    )
    return this.getClaim(id)
  }

  async getProfileForPublicKey(publicKey) {
    const id = await this.redis.get(
      this.makePublicKeyKey(publicKey)
    )
    return this.getClaim(id)
  }

  async storeBlock(block: PoetBlock) {
    await Promise.all(
      block.claims.map(claim => this.storeClaim(claim))
    )
    await this.redis.save(
      this.makeBlockId(block.id.toString('hex')),
      this.creator.getEncodedBlockForSaving(block)
    )
  }
}