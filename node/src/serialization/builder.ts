const bitcore = require('bitcore-lib')
const explorers = require('bitcore-explorers')
import { Claim, Block, sha256, sign, hex, ClaimProto, BlockProto, ClaimBuilder as ClaimBuilderPoet } from 'poet-js'

export class ClaimBuilder {

  createSignedClaim(claim: Claim, privateKey: string): Claim {
    const key = typeof privateKey === 'string'
              ? new bitcore.PrivateKey(privateKey)
              : privateKey
    const id = this.getId(claim, key)
    const signature = sign(key, id)

    return {
      id: hex(id),
      publicKey: key.publicKey.toString(),
      signature: hex(signature),

      type: claim.type,
      attributes: claim.attributes
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

  createBlock(claims: Claim[]): Block {
    const block = BlockProto.create({
      id: new Buffer(''),
      claims: claims.map(ClaimBuilderPoet.claimToProto)
    })
    const id = ClaimBuilderPoet.getIdForBlock(block)
    return {
      id,
      claims
    }
  }

}
