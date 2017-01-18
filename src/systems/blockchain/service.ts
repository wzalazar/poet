import 'reflect-metadata'

import * as bluebird from 'bluebird'
import { Connection, Repository } from 'typeorm'

import { Block as PureBlock, ClaimType, Claim as PureClaim } from '../../model/claim'
import { getHash } from '../../helpers/torrentHash'

import Claim from './orm/claim'
import Block from './orm/block'
import BlockInfo from './orm/blockInfo'
import Attribute from './orm/attribute'
import ClaimInfo from './orm/claimInfo'

import { BlockMetadata } from '../../events'
import rules from './rules'
import { Hook } from './rules'
import { ClaimBuilder } from '../../model/builder'

export default class BlockchainService {
  db: Connection
  started: boolean
  creator: ClaimBuilder

  confirmHooks: { [key in ClaimType]: Hook[] } = {
    'CreativeWork': [] as Hook[],
    'Title'       : [] as Hook[],
    'License'     : [] as Hook[],
    'Offering'    : [] as Hook[],
    'Profile'     : [] as Hook[],
    'Certificate' : [] as Hook[],
    'Revokation'  : [] as Hook[],
  }

  constructor()
  {
    this.setupHooks()
    this.started = false
  }

  setupHooks() {
    // TODO: Scan "rules" folder
    for (let rule of rules) {
      this.addHook(rule.type, rule.hook)
    }
  }

  addHook(type: ClaimType, hook: Hook) {
    this.confirmHooks[type].push(hook)
  }

  async start(
    getConnection: () => Promise<Connection>,
    getBuilder: () => Promise<ClaimBuilder>
  ) {
    if (this.started) {
      return
    }
    this.db = await getConnection()
    this.started = true
    this.creator = await getBuilder()
    return
  }

  async storeBlock(block: PureBlock) {
    await this.saveBlockIfNotExists(block)
    const id = await getHash(this.creator.serializeBlockForSave(block), block.id)
    this.createOrUpdateBlockInfo({ hash: block.id, torrentHash: id })
  }

  async storeClaim(claim: PureClaim) {
    const attributeSet = []
    for (let key in claim.attributes) {
      const value: string = claim.attributes[key]
      attributeSet.push(this.storeAttribute(key, value))
    }
    return await this.claimRepository.persist(this.claimRepository.create(claim))
  }

  async storeAttribute(key: string, value: string) {
    const repository = this.attributeRepository
    const result = repository.create({ key, value })
    await repository.persist(result)
    return result
  }

  async confirmBlock(blockInfo: BlockMetadata) {
    blockInfo = await this.createOrUpdateBlockInfo(blockInfo)

    console.log('Created or updated', blockInfo)

    const block = await this.getBlock(blockInfo.hash)

    if (block) {
      return await this.confirmBlockWithData(blockInfo, block)
    }
    return
  }

  async confirmBlockWithData(blockInfo: BlockMetadata, block: PureBlock) {
    return await Promise.all(
      block.claims.map((claim, index) => {
        return this.confirmClaim(claim, blockInfo, index)
      })
    )
  }

  async confirmClaim(claim: PureClaim, txInfo: BlockMetadata, index: number) {
    await this.claimInfoRepository.persist(this.claimInfoRepository.create({
      id: claim.id,
      poetOrder: index,
      ...txInfo
    }))
    return await bluebird.all(
      this.confirmHooks[claim.type].map(hook => hook(claim, txInfo))
    )
  }

  get attributeRepository(): Repository<Attribute> {
    return this.db.getRepository(Attribute)
  }

  get blockInfoRepository(): Repository<BlockInfo> {
    return this.db.getRepository(BlockInfo)
  }

  get claimRepository(): Repository<Claim> {
    return this.db.getRepository(Claim)
  }

  get claimInfoRepository(): Repository<ClaimInfo> {
    return this.db.getRepository(ClaimInfo)
  }

  get blockRepository(): Repository<Block> {
    return this.db.getRepository(Block)
  }

  async getBlockInfoByTorrentId(hash: string) {
    return await this.blockInfoRepository.findOne({ torrentHash: hash })
  }

  private async saveBlockIfNotExists(block: PureBlock) {
    const exists = await this.getBlock(block.id)
    if (exists) {
      return
    }
    const claimSet: Claim[] = []
    for (let claim of block.claims) {
      claimSet.push(await this.storeClaim(claim))
    }
    return await this.blockRepository.persist(this.blockRepository.create({
      id: block.id,
      claims: claimSet
    }))
  }

  async getBlock(id: string) {
    const blockEntry = await this.fetchBlock(id)

    if (!blockEntry) {
      return null
    }
    const block = { id, claims: [] as PureClaim[] } as PureBlock
    for (let claimEntry of blockEntry.claims) {
      const claim = this.transformEntityToPureClaim(claimEntry)
      block.claims.push(claim)
    }
    return block
  }

  private fetchBlock(id: string) {
    return this.blockRepository
      .createQueryBuilder('block')
      .leftJoinAndSelect('block.claims', 'claims')
      .leftJoinAndSelect('block.claims.attributes', 'attributes')
      .where('block.id=:blockId')
      .setParameters({blockId: id})
      .getOne()
  }

  private transformEntityToPureClaim(claimEntry: Claim) {
    const attributes: { [key: string]: string } = {}
    for (let attribute of claimEntry.attributes) {
      attributes[attribute.key] = attribute.value
    }
    return {
      id: claimEntry.id,
      publicKey: claimEntry.publicKey,
      signature: claimEntry.signature,
      type: claimEntry.type,
      attributes
    } as PureClaim
  }

  private async createOrUpdateBlockInfo(blockInfo: BlockMetadata) {
    const existent = await this.blockInfoRepository.findOne({ torrentHash: blockInfo.torrentHash })
    if (existent) {
      Object.assign(existent, blockInfo)
      return await this.blockInfoRepository.persist(existent)
    }
    const entity = this.blockInfoRepository.create(blockInfo)
    return await this.blockInfoRepository.persist(entity)
  }
}
