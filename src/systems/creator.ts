import * as Bluebird from "bluebird"

const bitcore = require('bitcore-lib')
const explorers = require('bitcore-explorers')
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet

import { Claim, PoetBlock } from "../model/claim"
import * as common from "../common"
import { default as getBuilder, Builders } from "../model/loaders"

const insightInstance = new explorers.Insight()
function promisifyInsight(name: string) {
  return Bluebird.promisify(insightInstance[name]).bind(insightInstance)
}

const insight = {
  getUnspentUtxos : promisifyInsight('getUnspentUtxos'),
  broadcast       : promisifyInsight('broadcast')
}

const poetAddress = 'mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C'

function hex(buffer: Buffer | Uint8Array): string {
  return buffer instanceof Buffer
    ? buffer.toString('hex')
    : (buffer as Buffer).toString('hex')
}

export default async function getCreator() {
  const builder = await getBuilder()
  return new ClaimCreator(builder)
}

class ClaimCreator {

  poetBlock
  attribute
  claim

  constructor(builders: Builders) {
    this.poetBlock = builders.poetBlock
    this.attribute = builders.attribute
    this.claim = builders.claimBuilder
  }

  bitcoinPriv = new bitcore.PrivateKey('343689da46542f2af204a3ced0ce942af1c25476932aa3a48af5e683df93126b')

  createSignedClaim(data, privateKey: string): Claim {
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

  getId(data, key: Object): Uint8Array {
    return common.sha256(this.getEncodedForSigning(data, key))
  }

  getIdForBlock(block): string {
    return common.sha256(this.poetBlock.encode(block).finish()).toString('hex')
  }

  getAttributes(attrs) {
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

  getEncodedForSigning(data, privateKey: Object): Uint8Array {
    return this.claim.encode(this.claim.create({
      id: new Buffer(''),
      publicKey: privateKey['publicKey'].toBuffer(),
      signature: new Buffer(''),
      type: data.type,
      attributes: this.getAttributes(data.attributes)
    })).finish()
  }

  protoToBlockObject(proto): PoetBlock {
    return {
      id: proto.id.toString('hex'),
      claims: proto.claims.map(this.protoToClaimObject.bind(this))
    }
  }

  serializedToBlock(block: string) {
    try {
      const decoded = this.poetBlock.decode(new Buffer(block, 'hex'))
      const obj = this.protoToBlockObject(decoded)
      return obj
    } catch (e) {
      console.log(e, e.stack)
    }
  }

  serializeBlockForSave(block: PoetBlock) {
    return new Buffer(this.poetBlock.encode(this.poetBlock.create({
      id: new Buffer(block.id, 'hex'),
      claims: block.claims.map(this.claimToProto.bind(this))
    })).finish()).toString('hex')
  }

  serializeClaimForSave(claim: Claim) {
    return new Buffer(this.claim.encode(this.claimToProto(claim)).finish()).toString('hex')
  }

  serializedToClaim(claim: string) {
    try {
      const decoded = this.claim.decode(new Buffer(claim, 'hex'))
      const obj = this.protoToClaimObject(decoded)
      return obj
    } catch (e) {
      console.log(e, e.stack)
    }
  }

  protoToClaimObject(proto): Claim {
    const attributes = {}

    proto.attributes.forEach(attr => {
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

  createBlock(claims: Claim[]): PoetBlock {
    var protoClaims = claims.map((claim: Claim) => {
      return this.claimToProto(claim)
    })
    const block = this.poetBlock.create({
      id: new Buffer(''),
      claims: protoClaims
    })
    const id = this.getIdForBlock(block)
    console.log(claims[0], this.serializedToClaim(this.serializeClaimForSave(claims[0])))
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
    return insight.getUnspentUtxos(poetAddress)
      .then(utxos => new bitcore.Transaction()
          .from(utxos)
          .change(poetAddress)
          .addData(data)
          .sign(this.bitcoinPriv)
      )
  }

  broadcastTx(tx) {
    return insight.broadcast(tx)
  }
}
