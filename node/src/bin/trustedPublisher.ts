import * as Koa from "koa";
import {Claim, Block, WORK, TITLE, OFFERING, LICENSE, CERTIFICATE} from "../claim";
import {default as getCreator, ClaimBuilder} from "../serialization/builder";
import {getHash} from "../helpers/torrentHash";
import {Queue} from "../queue";
import Fields from "../blockchain/fields";

const bitcore = require('bitcore-lib')
const Body = require('koa-body')
const Route = require('koa-route')

const privKey = 'cf5bd2d3d179493adfc41da206adb2ffd212ea34870722bc92655f8c8fd2ef33'

export interface TrustedPublisherOptions {
  port: number
  broadcast: boolean
}

export default async function createServer(options?: TrustedPublisherOptions) {
  const koa = new Koa()
  const creator = await getCreator()
  const queue = new Queue()

  koa.use(Body({ textLimit: 1000000 }))

  const createBlock = async (claims: Claim[], ctx: any) => {

    const certificates = claims.map(claim => creator.createSignedClaim({
      type: CERTIFICATE,
      attributes: {
        [Fields.REFERENCE]: claim.id,
        [Fields.CERTIFICATION_TIME]: '' + Date.now()
      }
    }, privKey))

    const block: Block = creator.createBlock(claims.concat(certificates))
    try {
      await queue.announceBlockToSend(block)
    } catch (error) {
      console.log('Could not publish block', error, error.stack)
    }

    try {
      const id = await getHash(creator.serializeBlockForSave(block), block.id)
      const tx = await creator.createTransaction(id)
      console.log('Bitcoin transaction hash is', tx.hash)
      console.log('Torrent hash is', id)

      if (!options.broadcast) {
        return
      }

      ctx.body = await ClaimBuilder.broadcastTx(tx)
    } catch (error) {
      ctx.body = JSON.stringify({ error })
    }
  }

  koa.use(Route.post('/licenses', async (ctx: any) => {
    const body = JSON.parse(ctx.request.body)
    const claims = [creator.createSignedClaim({
      type: LICENSE,
      attributes: {
        [Fields.REFERENCE]: body.reference,
        [Fields.REFERENCE_OFFERING]: body.referenceOffering,
        [Fields.PROOF_TYPE]: "Bitcoin Transaction",
        [Fields.PROOF_VALUE]: JSON.stringify({
          txId: body.txId,
          outputIndex: body.outputIndex
        }),
        [Fields.LICENSE_HOLDER]: body.owner
      }
    }, privKey)]
    await createBlock(claims, ctx)
  }))

  koa.use(Route.post('/claims', async (ctx: any) => {
    var sigs = JSON.parse(ctx.request.body).signatures
    const originalClaims: Claim[] = []
    for (let sig of sigs) {
      const claim = creator.serializedToClaim(
        new Buffer(new Buffer(sig.message, 'hex').toString(), 'hex')
      )
      claim.signature = sig.signature
      claim.id = new Buffer(creator.getId(claim)).toString('hex')
      console.log(claim)
      originalClaims.push(claim)
    }
    const claims: any[] = []
    let reference: any
    for (let claim of originalClaims) {
      if (claim.type === OFFERING) {
        claim.attributes[Fields.REFERENCE] = reference
      }
      claims.push(claim)
      if (claim.type === WORK) {
        reference = claim.id
        claims.push(creator.createSignedClaim({
          type: TITLE,
          attributes: {
            reference: claim.id,
            owner: claim.publicKey,
          }
        }, privKey))
      }
    }
    await createBlock(claims, ctx)
  }))

  koa.use(async (ctx: any, next: Function) => {
    try {
      await next()
    } catch (error) {
      console.log(`Error processing ${ctx.method} ${ctx.path}`, error, error.stack)
    }
  })

  return koa
}

export async function start(options?: TrustedPublisherOptions) {
  options = Object.assign({}, {
    port: 6000,
    broadcast: true
  }, options || {})
  const server = await createServer(options)
  await server.listen(options.port)

  console.log('Server started successfully.')
}

if (!module.parent) {
  start().catch(error => {
    console.log('Unable to start Trusted Publisher server:', error, error.stack)
  })
}
