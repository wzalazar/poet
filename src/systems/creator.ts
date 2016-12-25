import * as path from 'path'
import * as Promise from 'bluebird'
import * as protobuf from 'protobufjs'

import { Claim, PoetBlock, CreativeWork } from '../model/claim'
import * as common from '../common'
import { default as builders } from '../model/loaders'

const bitcore = require('bitcore-lib')
const explorers = require('bitcore-explorers')
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet

const insightInstance = new explorers.Insight()
function promisifyInsight(name: string) {
  return Promise.promisify(insightInstance[name]).bind(insightInstance)
}

const insight = {
  getUnspentUtxos : promisifyInsight('getUnspentUtxos'),
  broadcast       : promisifyInsight('broadcast')
}

const poetAddress = 'mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C'

var claimBuilder: protobuf.Type
var attribute: protobuf.Type
var poetBlock: protobuf.Type

builders.then(built => {
  claimBuilder = built.claimBuilder
  attribute = built.attribute
  poetBlock = built.poetBlock
})

function hex(buffer: Buffer | Uint8Array): string {
  return buffer instanceof Buffer
    ? buffer.toString('hex')
    : (buffer as Buffer).toString('hex')
}

export class ClaimCreator {

  trustedNotaries = [
    '0203d1e2fab0aba2ad5399c44a7e4f5259c26e03f957cb6d57161b6f49114803cf'
  ]

  notaryPriv = new bitcore.PrivateKey('ab1265f85b5f009902246b9a1ad847ef030b626174cf7a91ba2e704a264bb559')

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
    return common.sha256(poetBlock.encode(block).finish()).toString('hex')
  }

  getAttributes(attrs) {
    if (attrs instanceof Array) {
      return attrs.map(attr => {
        console.log('Case a, creating attribute', attr.key, attr.value, attr)
        return attribute.create(attr)
      })
    } else {
      return Object.keys(attrs).map(attr => {
        console.log('Case b, creating attribute', attr, attrs[attr])
        return attribute.create({
          key: attr,
          value: attrs[attr]
        })
      })
    }
  }

  getEncodedForSigning(data, privateKey: Object): Uint8Array {
    return claimBuilder.encode(claimBuilder.create({
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
      const decoded = poetBlock.decode(new Buffer(block, 'hex'))
      const obj = this.protoToBlockObject(decoded)
      return obj
    } catch (e) {
      console.log(e, e.stack)
    }
  }

  serializeBlockForSave(block: PoetBlock) {
    return new Buffer(poetBlock.encode(poetBlock.create({
      id: new Buffer(block.id, 'hex'),
      claims: block.claims.map(this.claimToProto.bind(this))
    })).finish()).toString('hex')
  }

  serializeClaimForSave(claim: Claim) {
    return new Buffer(claimBuilder.encode(this.claimToProto(claim)).finish()).toString('hex')
  }

  serializedToClaim(claim: string) {
    try {
      const decoded = claimBuilder.decode(new Buffer(claim, 'hex'))
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
    return claimBuilder.create({
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
    const block = poetBlock.create({
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

// Notary 
//   priv: 'ab1265f85b5f009902246b9a1ad847ef030b626174cf7a91ba2e704a264bb559'
//   pub: '0203d1e2fab0aba2ad5399c44a7e4f5259c26e03f957cb6d57161b6f49114803cf'


// Poet main address
//   Priv: 343689da46542f2af204a3ced0ce942af1c25476932aa3a48af5e683df93126b
//   Pub: 03155e888e65e9304d8139cc34007c86db3adde6d7297cd31f7f7f6fdd42dfb4dc
//   Addr: mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C