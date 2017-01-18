import 'reflect-metadata'

import * as bluebird from 'bluebird'
import { Connection, createConnection, Repository } from 'typeorm'

import { Block as PureBlock, ClaimType, Claim as PureClaim } from '../../model/claim'
import { getHash } from '../../helpers/torrentHash'

import Claim from './orm/claim'
import Block from './orm/block'
import BlockInfo from './orm/blockInfo'
import { PoetTxInfo } from '../../events'
import ClaimInfo from './orm/claimInfo'
import rules from './rules'
import { Hook } from './rules'
import { ClaimBuilder, default as getBuilder } from '../../model/builder'

export async function getConnection() {
  return createConnection({
    driver: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'poet',
      password: 'poet',
      database: 'poet'
    },
    entities: [
      __dirname + '/orm/*.ts'
    ],
    autoSchemaSync: true
  })
}

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

  constructor() {
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

  async start() {
    if (this.started) {
      return
    }
    this.db = await getConnection()
    this.started = true
    this.creator = await getBuilder()
    return
  }

  async storeBlock(block: PureBlock) {
    const claimSet = []
    for (let claim of block.claims) {
      claimSet.push(await this.storeClaim(claim))
    }
    await this.blockRepository.persist(this.blockRepository.create({
      id: block.id,
      claims: claimSet
    }))
    const id = await getHash(this.creator.serializeBlockForSave(block), block.id)
    const blockInfo = await this.getBlockByTorrentId(id)
    if (blockInfo) {
      return await this.confirmBlocksWithData(blockInfo, block)
    }
  }

  async getBlockByTorrentId(hash: string) {
    return await this.blockInfoRepository.createQueryBuilder("blockInfo")
      .where("blockInfo.torrentHash=:hash")
      .setParameters({ hash })
      .getOne()
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
    const repository = this.db.getRepository('attribute')
    const result = repository.create({ key, value })
    await repository.persist(result)
    return result
  }

  async confirmBlock(blockInfo: PoetTxInfo) {
    const entity = this.blockInfoRepository.create({
      id: blockInfo.poetHash,
      ...blockInfo
    })
    await this.blockInfoRepository.persist(entity)

    return await this.confirmBlocksWithData(blockInfo)
  }

  async confirmBlocksWithData(blockInfo: PoetTxInfo, block?: PureBlock) {
    if (!block) {
      block = await this.getBlock(blockInfo.poetHash)
    }
    if (!block) {
      return
    }
    return await Promise.all(
      block.claims.map((claim, index) => {
        return this.confirmClaim(claim, blockInfo, index)
      })
    )
  }

  async confirmClaim(claim: PureClaim, txInfo: PoetTxInfo, index: number) {
    await this.claimInfoRepository.persist(this.claimInfoRepository.create({
      id: claim.id,
      poetOrder: index,
      ...txInfo
    }))
    return await bluebird.all(
      this.confirmHooks[claim.type].map(hook => hook(claim, txInfo))
    )
  }

  async getBlock(id: string) {
    const blockEntry = await this.blockRepository
      .createQueryBuilder('block')
      .leftJoinAndSelect('block.claims', 'claims')
      .leftJoinAndSelect('block.claims.attributes', 'attributes')
      .where('block.id=:blockId')
      .setParameters({ blockId: id })
      .getOne()

    if (!blockEntry) {
      throw new Error(`Block with id ${id} not found!`)
    }
    const block = { id, claims: [] as PureClaim[] } as PureBlock
    for (let claimEntry of blockEntry.claims) {
      const attributes: { [key: string]: string } = {}
      for (let attribute of claimEntry.attributes) {
        attributes[attribute.key] = attribute.value
      }
      const claim = {
        id: claimEntry.id,
        publicKey: claimEntry.publicKey,
        signature: claimEntry.signature,
        type: claimEntry.type,
        attributes
      } as PureClaim
      block.claims.push(claim)
    }
    return block
  }

  get blockInfoRepository(): Repository<BlockInfo> {
    return this.db.getRepository('blockInfo') as Repository<BlockInfo>
  }

  get claimRepository(): Repository<Claim> {
    return this.db.getRepository('claim') as Repository<Claim>
  }

  get claimInfoRepository(): Repository<ClaimInfo> {
    return this.db.getRepository('claimInfo') as Repository<ClaimInfo>
  }

  get blockRepository(): Repository<Block> {
    return this.db.getRepository('block') as Repository<Block>
  }
}
