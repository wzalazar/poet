import * as IORedis from "ioredis"
import * as Bluebird from "bluebird"

import { PoetBlock, TITLE, LICENSE, CERTIFICATE, PROFILE, REVOKATION } from "../model/claim"
import { BitcoinBlockInfo } from "../events/bitcoin/blockInfo"
import { ClaimCreator } from "./creator"

export default class Db {
  redis: IORedis.Redis
  creator: ClaimCreator

  constructor(creator: ClaimCreator) {
    this.redis = new IORedis()
    this.creator = creator
  }

  static makeBlockId(id: string) {
    return 'block-' + id
  }

  static makeClaimId(id: string) {
    return 'claim-' + id
  }

  static makeTitleFor(id: string) {
    return 'title-' + id
  }

  static makePublicKeyKey(id: string) {
    return 'pubkey-' + id
  }

  static makeLicenseSetKey(key) {
    return 'licenses-' + key
  }

  static makeJudgementKey(key) {
    return 'judgements-' + key
  }

  async getBlock(id: string) {
    const block = await this.redis.get(Db.makeBlockId(id))
    if (!block) {
      return
    }
    return this.creator.serializedToBlock(block)
  }

  async getClaim(id: string) {
    const claim = await this.redis.get(Db.makeClaimId(id))
    if (!claim) {
      return
    }
    return this.creator.serializedToClaim(claim)
  }

  async storeClaim(claim) {
    switch (claim.type) {
      case PROFILE:
        await this.redis.set(Db.makePublicKeyKey(claim.publicKey), claim.id)
        break;
      case TITLE:
        if (claim.attributes.for) {
          await this.redis.set(Db.makeTitleFor(claim.attributes.for), claim.id)
        }
        break;
      case LICENSE:
        if (claim.attributes.for) {
          await this.redis.sadd(Db.makeLicenseSetKey(claim.attributes.for), claim.id)
        }
        break;
      case CERTIFICATE:
      case REVOKATION:
        if (claim.attributes.for) {
          await this.redis.sadd(Db.makeJudgementKey(claim.attributes.for), claim.id)
        }
        break;
      default:
        break;
    }
    await this.redis.sadd('claims', claim.id)
    return await this.redis.set(
      Db.makeClaimId(claim.id),
      this.creator.serializeClaimForSave(claim)
    )
  }

  async storeBlock(block: PoetBlock) {
    await Bluebird.all(
      block.claims.map(claim => this.storeClaim(claim))
    )
    await this.redis.sadd('blocks', block.id)
    await this.redis.set(
      Db.makeBlockId(block.id),
      this.creator.serializeBlockForSave(block)
    )
  }

  async markBlockOnBlockchain(info: BitcoinBlockInfo) {
    await Bluebird.all(info.poet.map(txInfo => {
      const id = txInfo.poetHash
      return Bluebird.all([
        this.redis.set('bitcoinOutputOrder-' + id, txInfo.outputIndex),
        this.redis.set('bitcoinTransaction-' + id, txInfo.txHash),
        this.redis.set('bitcoinBlock-' + id, info.blockHash),
        this.redis.set('bitcoinBlockOrder-' + id, info.blockHeight),
      ])
    }))
  }

  async getTitleFor(claimId) {
    const id = await this.redis.get(
      Db.makeTitleFor(claimId)
    )
    return this.getClaim(id)
  }

  async getProfileForPublicKey(publicKey) {
    const id = await this.redis.get(
      Db.makePublicKeyKey(publicKey)
    )
    return this.getClaim(id)
  }

  async getAllBlocks() {
    const blockIds = this.redis.smembers('blocks')
    return await Bluebird.all(blockIds.map(id => {
      return this.getBlock(id)
    }))
  }

  async getAllClaims() {
    const claimIds = await this.redis.smembers('claims')
    return await Bluebird.all(claimIds.map(id => {
      return this.getClaim(id)
    }))
  }
}