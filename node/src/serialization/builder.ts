const bitcore = require('bitcore-lib')
const explorers = require('bitcore-explorers')
import { UtxosByAddressResponse } from 'insight-client-js'
import { Claim, Block, sha256, sign, hex, VERSION, BARD, ClaimProto, BlockProto, ClaimBuilder as ClaimBuilderPoet } from 'poet-js'

import { InsightClient } from '../insight'

bitcore.Networks.defaultNetwork = bitcore.Networks.testnet

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

  getEncodedForSigning(data: any, privateKey?: any): Uint8Array {
    return ClaimProto.encode(ClaimProto.create({
      id: new Buffer(''),
      publicKey: data.publicKey || privateKey['publicKey'].toBuffer(),
      signature: new Buffer(''),
      type: data.type,
      attributes: ClaimBuilderPoet.getAttributes(data.attributes)
    })).finish()
  }

  serializedToBlock(block: Buffer) {
    try {
      const decoded = BlockProto.decode(block)
      return ClaimBuilderPoet.protoToBlockObject(decoded)
    } catch (e) {
      console.log(e, e.stack)
    }
  }

  serializeBlockForSave(block: Block) {
    return new Buffer(BlockProto.encode(BlockProto.create({
      id: new Buffer(block.id, 'hex'),
      claims: block.claims.map(ClaimBuilderPoet.claimToProto)
    })).finish())
  }

  serializedToClaim(claim: Buffer) {
    try {
      const decoded = ClaimProto.decode(claim)
      return ClaimBuilderPoet.protoToClaimObject(decoded)
    } catch (e) {
      console.log(e, e.stack)
    }
  }

  createBlock(claims: Claim[]): Block {
    const protoClaims = claims.map((claim: Claim) => {
      return ClaimBuilderPoet.claimToProto(claim)
    })
    const block = BlockProto.create({
      id: new Buffer(''),
      claims: protoClaims
    })
    const id = ClaimBuilderPoet.getIdForBlock(block)
    return {
      id,
      claims
    }
  }

  createTransaction(blockId: string, privateKey: string, address: string) {
    console.log('Creating tx for', blockId)
    const data = Buffer.concat([
      BARD,
      VERSION,
      new Buffer(blockId, 'hex')
    ])
    return InsightClient.Address.Utxos.get(address)
      .then((utxos: UtxosByAddressResponse) => new bitcore.Transaction()
        .from(utxos)
        .change(address)
        .addData(data)
        .sign(privateKey)
      )
  }

}
