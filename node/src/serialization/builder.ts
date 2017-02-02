import * as Bluebird from 'bluebird'

import { Claim, Block } from '../claim'
import * as common from '../common'
import { hex } from '../common'
import { default as loadBuilders, Builders } from './loaders'

const bitcore = require('bitcore-lib')
const explorers = require('bitcore-explorers')
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet

const insightInstance = new explorers.Insight()
function promisifyInsight(name: string) {
  return Bluebird.promisify(insightInstance[name]).bind(insightInstance)
}

const insight = {
  getUtxos  : promisifyInsight('getUnspentUtxos'),
  broadcast : promisifyInsight('broadcast')
}

const poetAddress = 'mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C'

export default function getBuilder(): Promise<ClaimBuilder> {
  return loadBuilders().then(loader => new ClaimBuilder(loader))
}

export class ClaimBuilder {

  block: protobuf.Type
  attribute : protobuf.Type
  claim     : protobuf.Type

  constructor(builders: Builders) {
    this.block     = builders.block
    this.attribute = builders.attribute
    this.claim     = builders.claim
  }

  bitcoinPriv = new bitcore.PrivateKey('343689da46542f2af204a3ced0ce942af1c25476932aa3a48af5e683df93126b')

  createSignedClaim(data: any, privateKey: string): Claim {
    const key = typeof privateKey === 'string'
              ? new bitcore.PrivateKey(privateKey)
              : privateKey
    const id = this.getId(data, key)
    const signature = common.sign(key, id)

    return {
        id: hex(id),
        publicKey: key.publicKey.toString(),
        signature: hex(signature),

        type: data.type,
        attributes: data.attributes
    }
  }

  addSignature(data: any, signature: string): Claim {
    const id = this.getId(data)
    return {
      ... data,
      signature: new Buffer(signature, 'hex')
    }
  }

  getId(data: any, key?: Object): Uint8Array {
    return common.sha256(this.getEncodedForSigning(data, key))
  }

  getIdForBlock(block: any): string {
    return common.sha256(this.block.encode(block).finish()).toString('hex')
  }

  getAttributes(attrs: any) {
    if (attrs instanceof Array) {
      return attrs.map(attr => {
        return this.attribute.create(attr)
      })
    } else {
      return Object.keys(attrs).map(attr => {
        return this.attribute.create({
          key: attr,
          value: attrs[attr]
        })
      })
    }
  }

  getEncodedForSigning(data: any, privateKey?: any): Uint8Array {
    return this.claim.encode(this.claim.create({
      id: new Buffer(''),
      publicKey: data.publicKey || privateKey['publicKey'].toBuffer(),
      signature: new Buffer(''),
      type: data.type,
      attributes: this.getAttributes(data.attributes)
    })).finish()
  }

  protoToBlockObject(proto: any): Block {
    return {
      id: proto.id.toString('hex'),
      claims: proto.claims.map(this.protoToClaimObject.bind(this))
    }
  }

  serializedToBlock(block: Buffer) {
    try {
      const decoded = this.block.decode(block)
      return this.protoToBlockObject(decoded)
    } catch (e) {
      console.log(e, e.stack)
    }
  }

  serializeBlockForSave(block: Block) {
    return new Buffer(this.block.encode(this.block.create({
      id: new Buffer(block.id, 'hex'),
      claims: block.claims.map(this.claimToProto.bind(this))
    })).finish())
  }

  serializeClaimForSave(claim: Claim) {
    return new Buffer(this.claim.encode(this.claimToProto(claim)).finish())
  }

  serializedToClaim(claim: Buffer) {
    try {
      const decoded = this.claim.decode(claim)
      return this.protoToClaimObject(decoded)
    } catch (e) {
      console.log(e, e.stack)
    }
  }

  protoToClaimObject(proto: any): Claim {
    const attributes: any = {}

    proto.attributes.forEach((attr: any) => {
      attributes[attr.key] = attr.value
    })

    return {
      id: proto.id.toString('hex'),
      publicKey: proto.publicKey.toString('hex'),
      signature: proto.signature.toString('hex'),
      type: proto.type,
      attributes
    }
  }

  claimToProto(obj: Claim) {
    return this.claim.create({
      id: new Buffer(obj.id, 'hex'),
      publicKey: new Buffer(obj.publicKey, 'hex'),
      signature: new Buffer(obj.signature, 'hex'),
      type: obj.type,
      attributes: this.getAttributes(obj.attributes)
    })
  }

  createBlock(claims: Claim[]): Block {
    const protoClaims = claims.map((claim: Claim) => {
      return this.claimToProto(claim)
    })
    const block = this.block.create({
      id: new Buffer(''),
      claims: protoClaims
    })
    const id = this.getIdForBlock(block)
    return {
      id,
      claims
    }
  }

  createTransaction(blockId: string) {
    console.log('Creating tx for', blockId)
    const data = Buffer.concat([
      new Buffer('BARD'),
      new Buffer([0, 0, 0, 1]),
      new Buffer(blockId, 'hex')
    ])
    return insight.getUtxos(poetAddress)
      .then((utxos: any) => new bitcore.Transaction()
          .from(utxos)
          .change(poetAddress)
          .addData(data)
          .sign(this.bitcoinPriv)
      )
  }

  static broadcastTx(tx: any) {
    return insight.broadcast(tx)
  }
}
