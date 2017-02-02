const bitcore = require('bitcore-lib')

export function getSighash(tx: any /* TODO: TYPE: bitcore.Transaction */, address: string /* TODO: TYPE: bitcore.Address */): Buffer[] {
  return tx.inputs.map(
    (input: any, index: number) =>
      bitcore.Transaction.Sighash.sighashPreimage(
        tx,
        bitcore.crypto.Signature.SIGHASH_ALL,
        index,
        bitcore.Script.buildPublicKeyHashOut(address)
      )
  )
}

export function applyHexSignaturesInOrder(tx: any /* TODO: TYPE: bitcore.Transaction */, signatures: any, publicKey: any /* TODO: TYPE: bitcore.PublicKey */) {
  return tx.inputs.map(
    (input: any, index: number) => {
      tx.applySignature({
        inputIndex: index,
        sigtype: bitcore.crypto.Signature.SIGHASH_ALL,
        publicKey: publicKey,
        signature: bitcore.crypto.Signature.fromDER(new Buffer(signatures[index].signature, 'hex'))
      })
    }
  )
}
