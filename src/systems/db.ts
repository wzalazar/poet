Promise = require('bluebird')
import { PoetBlock, Claim, TITLE, LICENSE, CERTIFICATE, PROFILE, REVOKATION } from '../model/claim'
import { PoetInfo } from '../events/bitcoin/blockInfo'
import * as IORedis from 'ioredis'
import { ClaimCreator } from './creator'

import { default as Builders } from '../model/loaders'

export default class Db {
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

  makeLicenseSetKey(key) {
    return 'licenses-' + key
  }

  makeJudgementKey(key) {
    return 'judgements-' + key
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
    switch (claim.type) {
      case PROFILE:
        await this.redis.set(this.makePublicKeyKey(claim.publicKey), claim.id)
        break;
      case TITLE:
        if (claim.attributes.for) {
          await this.redis.set(this.makeTitleFor(claim.attributes.for), claim.id)
        }
        break;
      case LICENSE:
        if (claim.attributes.for) {
          await this.redis.sadd(this.makeLicenseSetKey(claim.attributes.for), claim.id)
        }
        break;
      case CERTIFICATE:
      case REVOKATION:
        if (claim.attributes.for) {
          await this.redis.sadd(this.makeJudgementKey(claim.attributes.for), claim.id)
        }
        break;
      default:
        break;
    }
    await this.redis.sadd('claims', claim.id)
    return await this.redis.set(
      this.makeClaimId(claim.id),
      this.creator.serializeForSave(claim)
    )
  }

  async storeBlock(block: PoetBlock) {
    await Promise.all(
      block.claims.map(claim => this.storeClaim(claim))
    )
    await this.redis.sadd('blocks', block.id)
    await this.redis.set(
      this.makeBlockId(block.id),
      this.creator.getEncodedBlockForSaving(block)
    )
  }

  async markBlockOnBlockchain(info: PoetInfo) {
    await Promise.all(info.poet.map(txInfo => {
      const id = txInfo.poetId
      return Promise.all([
        this.redis.set('bitcoinOutputOrder-' + id, txInfo.outputIndex),
        this.redis.set('bitcoinTransactionOrder-' + id, txInfo.blockOrder),
        this.redis.set('bitcoinTransaction-' + id, txInfo.hash),
        this.redis.set('bitcoinBlock-' + id, info.id),
        this.redis.set('bitcoinBlockOrder-' + id, info.height),
      ])
    }))
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

  async getAllBlocks() {
    const blockIds = this.redis.smembers('blocks')
    return await Promise.all(blockIds.map(id => {
      return this.getBlock(id)
    }))
  }

  async getAllClaims() {
    const claimIds = await this.redis.smembers('claims')
    const claims = await Promise.all(claimIds.map(id => {
      return this.getClaim(id)
    }))
    return claims
  }
}