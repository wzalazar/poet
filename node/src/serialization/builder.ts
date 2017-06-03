import * as Bluebird from 'bluebird'
const bitcore = require('bitcore-lib')
const explorers = require('bitcore-explorers')
import { sha256, sign, hex, VERSION, BARD, ClaimProto, AttributeProto, BlockProto } from 'poet-js'

import { Claim, Block } from '../claim'

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

const bitcoinPriv = new bitcore.PrivateKey('343689da46542f2af204a3ced0ce942af1c25476932aa3a48af5e683df93126b')

export class ClaimBuilder {

  createSignedClaim(data: any, privateKey: string): Claim {
    const key = typeof privateKey === 'string'
              ? new bitcore.PrivateKey(privateKey)
              : privateKey
    const id = this.getId(data, key)
    const signature = sign(key, id)

    return {
        id: hex(id),
        publicKey: key.publicKey.toString(),
        signature: hex(signature),

        type: data.type,
        attributes: data.attributes
    }
  }

  getId(data: any, key?: Object): Uint8Array {
    return sha256(this.getEncodedForSigning(data, key))
  }

  getIdForBlock(block: any): string {
    return sha256(BlockProto.encode(block).finish()).toString('hex')
  }

  getAttributes(attrs: any) {
    if (attrs instanceof Array) {
      return attrs.map(attr => {
        return AttributeProto.create(attr)
      })
    } else {
      return Object.keys(attrs).map(attr => {
        return AttributeProto.create({
          key: attr,
          value: attrs[attr]
        })
      })
    }
  }

  getEncodedForSigning(data: any, privateKey?: any): Uint8Array {
    return ClaimProto.encode(ClaimProto.create({
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
      const decoded = BlockProto.decode(block)
      return this.protoToBlockObject(decoded)
    } catch (e) {
      console.log(e, e.stack)
    }
  }

  serializeBlockForSave(block: Block) {
    return new Buffer(BlockProto.encode(BlockProto.create({
      id: new Buffer(block.id, 'hex'),
      claims: block.claims.map(this.claimToProto.bind(this))
    })).finish())
  }

  serializedToClaim(claim: Buffer) {
    try {
      const decoded = ClaimProto.decode(claim)
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
    return ClaimProto.create({
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
    const block = BlockProto.create({
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
      BARD,
      VERSION,
      new Buffer(blockId, 'hex')
    ])
    return insight.getUtxos(poetAddress)
      .then((utxos: any) => new bitcore.Transaction()
          .from(utxos)
          .change(poetAddress)
          .addData(data)
          .sign(bitcoinPriv)
      )
  }

  static broadcastTx(tx: any) {
    return insight.broadcast(tx)
  }
}
