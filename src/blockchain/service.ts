import 'reflect-metadata'
import * as bluebird from 'bluebird'
import { Connection, Repository } from 'typeorm'
import { Block as PureBlock, ClaimType, Claim as PureClaim } from '../claim'
import { getHash } from '../helpers/torrentHash'
import { BlockMetadata } from '../events'
import rules, { Hook } from './rules'
import { ClaimBuilder } from '../serialization/builder'
import Fields from './fields'
import Claim from './orm/claim'
import Block from './orm/block'
import Profile from './orm/derived/profile'
import BlockInfo from './orm/blockInfo'
import ClaimInfo from './orm/claimInfo'
import License from './orm/derived/license'
import Offering from './orm/derived/offering'
import Title from './orm/derived/title'
import Work from './orm/derived/work'
import Attribute from './orm/attribute'


export default class BlockchainService {
  db: Connection
  started: boolean
  creator: ClaimBuilder

  confirmHooks: { [key in ClaimType]: Hook[] } = {
    'Work'        : [] as Hook[],
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
        console.log('Confirming claim', claim)
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
    const result = await bluebird.all(
      this.confirmHooks[claim.type].map(hook => hook(this, claim, txInfo))
    )
    return result
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
      const claim = BlockchainService.transformEntityToPureClaim(claimEntry)
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
    blockEntry.claims = await this.claimRepository.createQueryBuilder('claim')
      .leftJoinAndMapMany('claim.attributes', 'claim.attributes', 'attribute')
      .where('claim.id IN (:claims)')
      .setParameters({claims: blockEntry.claims.map(claim => claim.id)})
      .getMany()
    return blockEntry
  }

  private static transformEntityToPureClaim(claimEntry: Claim) {
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
    if (blockMetadata.bitcoinHeight && (!existent || !existent.height)) {
      // Calculate poet height
      blockMetadata.height = await this.blockInfoRepository.createQueryBuilder('info')
          .where('info.height<>0')
          .getCount() + 1
    }
    if (existent) {
      for (let key of Object.keys(blockMetadata)) {
        const blockKey: keyof BlockMetadata = key as keyof BlockMetadata
        if (blockMetadata[blockKey] !== null && blockMetadata[blockKey] !== undefined) {
          existent[blockKey] = blockMetadata[blockKey]
        }
      }
      return await this.blockInfoRepository.persist(existent)
    } else {
      const entity = this.blockInfoRepository.create(blockMetadata)
      return await this.blockInfoRepository.persist(entity)
    }
  }

  async getOwnerPublicKey(referenceId: string) {
    const title = await this.titleRepository.findOne({ reference: referenceId })
    if (!title) {
      return null
    }
    const claim = await this.getClaim(title.id)
    if (claim) {
      return claim.attributes[Fields.OWNER_KEY]
    } else {
      throw new Error('Claim not found! ID:' + title.id)
    }
  }

  async getClaim(id: string) {
    const claim = await this.claimRepository.createQueryBuilder('claim')
      .leftJoinAndMapMany('claim.attributes', 'claim.attributes', 'attribute')
      .where('claim.id=:id')
      .setParameters({ id })
      .getOne()
    if (!claim) {
      return
    }
    return BlockchainService.transformEntityToPureClaim(claim)
  }

  async getWork(id: string) {
    const work = await this.workRepository.createQueryBuilder('work')
      .leftJoinAndMapOne('work.title', 'work.title', 'title')
      .leftJoinAndMapOne('work.owner', 'work.owner', 'owner')
      .leftJoinAndMapOne('work.author', 'work.author', 'author')
      .leftJoinAndMapMany('work.licenses', 'work.licenses', 'licenses')
      .leftJoinAndMapMany('work.offerings', 'work.offerings', 'offerings')
      .leftJoinAndMapMany('work.publishers', 'work.publishers', 'publishers')
      .where('work.id=:id')
      .setParameters({id})
      .getOne()
    return work
  }

  async getWorkFull(id: string) {
    const work = await this.workRepository.createQueryBuilder('work')
      .leftJoinAndMapOne('work.title', 'work.title', 'title')
      .leftJoinAndMapOne('work.owner', 'work.owner', 'owner')
      .leftJoinAndMapOne('work.author', 'work.author', 'author')
      .leftJoinAndMapMany('work.licenses', 'work.licenses', 'licenses')
      .leftJoinAndMapMany('work.offerings', 'work.offerings', 'offerings')
      .leftJoinAndMapMany('work.publishers', 'work.publishers', 'publishers')
      .where('work.id=:id')
      .setParameters({ id })
      .getOne()
    const info = await this.claimInfoRepository.findOneById(id)
    work.claimInfo = info
    return await this.augmentWork(work)
  }

  async augmentWork(work: Work) {
    const ids = [work.id]
    if (work.title) ids.push(work.title.id)
    if (work.owner) ids.push(work.owner.id)
    if (work.author) ids.push(work.author.id)
    if (work.licenses) for (let license of work.licenses) ids.push(license.id)
    if (work.offerings) for (let offering of work.offerings) ids.push(offering.id)
    if (work.publishers) for (let publisher of work.publishers) ids.push(publisher.id)
    const attributeResults = await this.attributeRepository.createQueryBuilder('attribute')
      .where('attribute.claim IN (:ids)')
      .leftJoinAndMapOne('attribute.claim', 'attribute.claim', 'claim')
      .setParameters({ ids })
      .getMany()
    const mapAttributes: { [key: string]: { [key2: string]: string } } = {}
    for (let attribute of attributeResults) {
      const id = attribute.claim.id
      mapAttributes[id] = mapAttributes[id] || {}
      mapAttributes[id][attribute.key] = attribute.value
    }
    work.attributes = mapAttributes[work.id]
    if (work.title) work.title.attributes = mapAttributes[work.title.id]
    if (work.owner) work.owner.attributes = mapAttributes[work.owner.id]
    if (work.author) work.author.attributes = mapAttributes[work.author.id]
    if (work.licenses) for (let license of work.licenses) license.attributes = mapAttributes[license.id]
    if (work.offerings) for (let offering of work.offerings) offering.attributes = mapAttributes[offering.id]
    if (work.publishers) for (let publisher of work.publishers) publisher.attributes = mapAttributes[publisher.id]
    return work
  }

  get blockInfoRepository(): Repository<BlockInfo> {
    return this.db.getRepository(BlockInfo)
  }

  get workRepository(): Repository<Work> {
    return this.db.getRepository(Work)
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

  get profileRepository(): Repository<Profile> {
    return this.db.getRepository(Profile)
  }

  get licenseRepository(): Repository<License> {
    return this.db.getRepository(License)
  }

  get offeringRepository(): Repository<Offering> {
    return this.db.getRepository(Offering)
  }

  get titleRepository(): Repository<Title> {
    return this.db.getRepository(Title)
  }

  get attributeRepository(): Repository<Attribute> {
    return this.db.getRepository(Attribute)
  }
}
