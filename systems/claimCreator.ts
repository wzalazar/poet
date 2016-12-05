import * as Promise from 'bluebird'
import * as protobuf from 'protobufjs'

import { Claim, CreativeWork } from '../model'
import * as common from '../common'

const bitcore = require('bitcore-lib')
const explorers = require('bitcore-explorers')
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet

const insightInstance = new explorers.Insight()
function promisifyInsight(name) {
    return Promise.promisify(insightInstance[name]).bind(insightInstance)
}

const insight = {
    getUnspentUtxos : promisifyInsight('getUnspentUtxos'),
    broadcast       : promisifyInsight('broadcast')
}

const poetAddress = 'mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C'

let claim
let claimSerialization
let attribute

const proto = protobuf.loadProtoFile('../model/claim.proto', (err, builder) => {
    claim              = builder.lookup('Poet.Claim')
    claimSerialization = builder.lookup('Poet.ClaimSerializationForsigning')
    attribute          = builder.lookup('Poet.Attribute')
})

class ClaimCreator {

    trustedNotaries = [
        '0203d1e2fab0aba2ad5399c44a7e4f5259c26e03f957cb6d57161b6f49114803cf'
    ]

    selfNotaryPriv = new bitcore.PrivateKey('ab1265f85b5f009902246b9a1ad847ef030b626174cf7a91ba2e704a264bb559')

    createClaim(data): Claim {
        const id = this.getId(data)
        const hash = bitcore.crypto.Hash.sha256(proto)
        const signature = bitcore.crypto.Signature

        return {
            id: hash.toString(),
            locator: '',
            publicKey: this.selfNotaryPriv.publicKey.toBuffer(),
            signature: signature,

            type: data.type,
            attributes: data.attributes
        }
    }

    getId(data): Buffer {
        return common.sha256(this.getEncodedForSigning(data))
    }

    getEncodedForSigning(data): Buffer {
        return claimSerializationBuilder.encode({
            publicKey: this.selfNotaryPriv.publicKey.toBuffer(),
            type: data.type,
            attributes: Object.keys(data.attributes).map(attribute => {
                attributeBuilder.create({
                    key: attribute,
                    value: data.attributes[attribute]
                })
            })
        }).finish()
    }

    protoToClaimObject(proto) {
        return null
    }

    objectToProto(obj) {
        return null
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
                .sign(this.selfNotaryPriv)
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