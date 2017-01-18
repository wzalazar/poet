import 'reflect-metadata'
import * as bluebird from 'bluebird'
import { Connection, Repository } from 'typeorm'

import { Block as PureBlock, ClaimType, Claim as PureClaim } from '../../model/claim'
import { getHash } from '../../helpers/torrentHash'
import { BlockMetadata } from '../../events'
import rules, { Hook } from './rules'
import { ClaimBuilder } from '../../model/builder'

import CreativeWork from './orm/creativeWork'
import Claim from './orm/claim'
import Block from './orm/block'
import Profile from './orm/profile'
import BlockInfo from './orm/blockInfo'
import ClaimInfo from './orm/claimInfo'

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
    await this.createOrUpdateBlockInfo({ hash: block.id, torrentHash: id })
  }

  async storeClaim(claim: PureClaim) {
    const attributeSet = []
    for (let key in claim.attributes) {
      const value: string = claim.attributes[key]
      attributeSet.push({ key, value, claim: claim.id })
    }
    return await this.claimRepository.persist(this.claimRepository.create({
      ...claim,
      attributes: attributeSet
    }))
  }

  async confirmBlock(blockInfo: BlockMetadata) {
    blockInfo = await this.createOrUpdateBlockInfo(blockInfo)
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
      hash: claim.id,
      blockHash: txInfo.hash,
      blockHeight: txInfo.height,
      claimOrder: index,
      ...txInfo
    }))
    return await bluebird.all(
      this.confirmHooks[claim.type].map(hook => hook(claim, txInfo))
    )
  }

  get blockInfoRepository(): Repository<BlockInfo> {
    return this.db.getRepository(BlockInfo)
  }

  get workRepository(): Repository<CreativeWork> {
    return this.db.getRepository('creativeWork') as Repository<CreativeWork>
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

  private async fetchBlock(id: string) {
    const blockEntry = await this.blockRepository.createQueryBuilder('block')
      .where('block.id=:id')
      .leftJoinAndMapMany('block.claims', 'block.claims', 'claim')
      .setParameters({ id})
      .getOne()
    if (!blockEntry) {
      return
    }
    const claimEntries = await this.claimRepository.createQueryBuilder('claim')
      .leftJoinAndMapMany('claim.attributes', 'claim.attributes', 'attribute')
      .where('claim.id IN (:claims)')
      .setParameters({ claims: blockEntry.claims.map(claim => claim.id) })
      .getMany()
    blockEntry.claims = claimEntries
    return blockEntry
  }

  private transformEntityToPureClaim(claimEntry: Claim) {
    if (!claimEntry) {
      console.log('Asked to confirm for null entry', claimEntry)
      return
    }
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

  private async createOrUpdateBlockInfo(blockMetadata: BlockMetadata) {
    const existent = await this.blockInfoRepository.findOne({ torrentHash: blockMetadata.torrentHash })
    if (existent) {
      for (let key of Object.keys(blockMetadata)) {
        const blockKey: keyof BlockMetadata = key as keyof BlockMetadata
        const blockInfoKey: keyof BlockInfo = blockKey
        if (blockMetadata[blockKey] !== null && blockMetadata[blockKey] !== undefined) {
          existent[blockInfoKey] = blockMetadata[blockKey]
        }
      }
      return await this.blockInfoRepository.persist(existent)
    } else {
      const entity = this.blockInfoRepository.create(blockMetadata)
      return await this.blockInfoRepository.persist(entity)
    }
  }

  get profileRepository(): Repository<Profile> {
    return this.db.getRepository('profile') as Repository<Profile>
  }
}
