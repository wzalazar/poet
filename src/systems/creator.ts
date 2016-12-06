import * as path from 'path'
import * as Promise from 'bluebird'
import * as protobuf from 'protobufjs'

import { Claim, CreativeWork } from '../model/claim'
import * as common from '../common'

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

var claim: protobuf.Type
var claimSerialization: protobuf.Type
var attribute: protobuf.Type

export default (protobuf.load(path.join(__dirname, '../model/claim.proto')) as Promise<protobuf.Root>)
  .then((builder: protobuf.Root) => {
    claim              = builder.lookup('Poet.Claim') as protobuf.Type
    claimSerialization = builder.lookup('Poet.ClaimSerializationForSigning') as protobuf.Type
    attribute          = builder.lookup('Poet.Attribute') as protobuf.Type

    return new ClaimCreator()
  })
  .catch(e => {
    console.log(e, e.stack)
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

  txPriv = new bitcore.PrivateKey('ab1265f85b5f009902246b9a1ad847ef030b626174cf7a91ba2e704a264bb559')

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

  getEncodedForSigning(data, privateKey: Object): Uint8Array {
    return claimSerialization.encode(claimSerialization.create({
      publicKey: privateKey['publicKey'].toBuffer(),
      type: data.type,
      attributes: Object.keys(data.attributes).map(attr => {
        return attribute.create({
          key: attr,
          value: data.attributes[attr]
        })
      })
    })).finish()
  }

  protoToClaimObject(proto) {
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

  objectToProto(obj) {
    return claim.create({
      id: new Buffer(obj.id, 'hex'),
      publicKey: new Buffer(obj.publicKey, 'hex'),
      signature: new Buffer(obj.signature, 'hex'),
      type: obj.type,
      attributes: Object.keys(obj.attributes).map(attr => {
        return attribute.create({
          key: attr,
          value: obj.attributes[attr]
        })
      })
    })
  }

  createTx(claimId: Buffer) {
    const data = bitcore.util.buffer.concat(
      new Buffer('BARD-'),
      claimId
    )
    return insight.getUnspentUtxos(poetAddress)
      .then(utxos => new bitcore.Transaction()
          .from(utxos)
          .change(poetAddress)
          .addData(data)
          .sign(this.txPriv)
      )
      .then(insight.broadcast)
    }
}

// Notary 
//   priv: 'ab1265f85b5f009902246b9a1ad847ef030b626174cf7a91ba2e704a264bb559'
//   pub: '0203d1e2fab0aba2ad5399c44a7e4f5259c26e03f957cb6d57161b6f49114803cf'


// Poet main address
//   Priv: 343689da46542f2af204a3ced0ce942af1c25476932aa3a48af5e683df93126b
//   Pub: 03155e888e65e9304d8139cc34007c86db3adde6d7297cd31f7f7f6fdd42dfb4dc
//   Addr: mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C