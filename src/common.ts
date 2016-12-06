const bitcore = require('bitcore-lib')

export function assert(value: boolean, message: string) {
    if (!value) {
        throw new Error(message)
    }
}

export function sha256(value: string | Buffer) {
    return bitcore.crypto.Hash.sha256(
        value instanceof Buffer
            ? value
            : new Buffer(value)
    )
}

export function sign(privateKey: string, value: Buffer): Buffer {
    return bitcore.crypto.ECDSA.sign(
        value,
        new bitcore.PrivateKey(privateKey)
    ).toBuffer()
}

export function verify(publicKey, signature: Buffer, value: Buffer): Boolean {
    return bitcore.crypto.ECDSA.verify(
        value,
        bitcore.crypto.Signature.fromBuffer(signature),
        publicKey
    )
}
