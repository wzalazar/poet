import * as bluebird from 'bluebird'
import { Connection, createConnection, Repository } from 'typeorm'

import { Block as PureBlock, ClaimType, Attribute } from '../../model/claim'
import { Claim as PureClaim } from '../../model/claim'
import * as Types from '../../model/claim'

import CreativeWork from './orm/creativeWork'
import Claim from './orm/claim'
import License from './orm/license'
import Block from './orm/block'
import Profile from './orm/profile'
import BlockInfo from './orm/blockInfo'
import Title from './orm/title'
import { PoetTxInfo, PoetBlockInfo } from '../../events'
import { assert, zip } from '../../common'
import ClaimInfo from './orm/claimInfo'

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

interface Hook {
  (claim: PureClaim, info: PoetTxInfo): any
}

export default class BlockchainService {
  db: Connection
  started: boolean

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
    this.started = false

    this.setupHooks()
  }

  setupHooks() {
    this.addHook(Types.CREATIVE_WORK, (claim: PureClaim, info: PoetTxInfo) => {

    })
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
    return
  }

  async storeBlock(block: PureBlock) {
    const claimSet = []
    for (let claim of block.claims) {
      claimSet.push(await this.storeClaim(claim))
    }
    return await this.blockRepository.persist(this.blockRepository.create({
      id: block.id,
      claims: claimSet
    }))
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

  async confirmBlock(blockInfo: PoetBlockInfo) {
    const entity = this.blockInfoRepository.create({
      id: blockInfo.poetHash,
      ...blockInfo
    })
    await this.blockInfoRepository.persist(entity)

    return await this.confirmBlocksWithData(blockInfo)
  }

  async confirmBlocksWithData(blockInfo: PoetBlockInfo) {
    const block = await this.getBlock(blockInfo.poetHash)
    if (!block) {
      return
    }
    return await Promise.all(
      zip(block.claims, blockInfo.poet, (claim, txInfo) => {
        return this.confirmClaim(txInfo, claim)
      })
    )
  }

  async confirmClaim(txInfo: PoetTxInfo, claim: PureClaim) {
    await this.claimInfoRepository.persist(this.claimInfoRepository.create({
      id: txInfo.poetHash,
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

  get workRepository(): Repository<CreativeWork> {
    return this.db.getRepository('creativeWork') as Repository<CreativeWork>
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

  get offerings(): Repository<License> {
    return this.db.getRepository('license') as Repository<License>
  }

  get profileRepository(): Repository<Profile> {
    return this.db.getRepository('profile') as Repository<Profile>
  }
}
