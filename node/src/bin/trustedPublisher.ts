import * as Koa from "koa"
import { Fields, ClaimTypes, Claim, Block } from 'poet-js'
const bitcore = require('bitcore-lib')
const Body = require('koa-body')
const Route = require('koa-route')

import { ClaimBuilder } from "../serialization/builder"
import { getHash } from "../helpers/torrentHash"
import { Queue } from "../queue"
import { InsightClient } from '../insight'

const privKey = 'cf5bd2d3d179493adfc41da206adb2ffd212ea34870722bc92655f8c8fd2ef33'
const bitcoinPriv = new bitcore.PrivateKey('343689da46542f2af204a3ced0ce942af1c25476932aa3a48af5e683df93126b')
const poetAddress = 'mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C'

export interface TrustedPublisherOptions {
  port: number
  broadcast: boolean
}

async function createServer(options?: TrustedPublisherOptions) {
  const koa = new Koa()
  const creator = new ClaimBuilder()
  const queue = new Queue()

  koa.use(Body({ textLimit: 1000000 }))

  const createBlock = async (claims: ReadonlyArray<Claim>, ctx: any) => {

    const certificates: ReadonlyArray<Claim> = claims.map(claim => creator.createSignedClaim({
      type: ClaimTypes.CERTIFICATE,
      attributes: {
        [Fields.REFERENCE]: claim.id,
        [Fields.CERTIFICATION_TIME]: '' + Date.now()
      }
    }, privKey))

    const block: Block = creator.createBlock([...claims, ...certificates])
    try {
      await queue.announceBlockToSend(block)
    } catch (error) {
      console.log('Could not publish block', error, error.stack)
    }

    try {
      const id = await getHash(creator.serializeBlockForSave(block), block.id)
      const tx = await creator.createTransaction(id, bitcoinPriv, poetAddress)
      const ntxid = tx.nid
      console.log('Bitcoin transaction hash is', tx.hash)
      console.log('Normalized transaction hash is', tx.nid)
      console.log('Torrent hash is', id)

      if (!options.broadcast) {
        return
      }

      await InsightClient.Transactions.send.post(tx)

      ctx.body = JSON.stringify({
        createdClaims: block.claims
      })
    } catch (error) {
      ctx.body = JSON.stringify({ error })
    }
  }

  koa.use(Route.post('/titles', async (ctx: any) => {
    const body = JSON.parse(ctx.request.body)
    const claims = [creator.createSignedClaim({
      type: ClaimTypes.TITLE,
      attributes: {
        [Fields.REFERENCE]: body.reference,
        [Fields.REFERENCE_OFFERING]: body.referenceOffering,
        [Fields.PROOF_TYPE]: "Bitcoin Transaction",
        [Fields.PROOF_VALUE]: JSON.stringify({
          txId: body.txId,
          ntxId: body.ntxId,
          outputIndex: body.outputIndex
        }),
        [Fields.REFERENCE_OWNER]: body.referenceOwner,
        [Fields.OWNER]: body.owner
      }
    }, privKey)]
    await createBlock(claims, ctx)
  }))

  koa.use(Route.post('/licenses', async (ctx: any) => {
    const body = JSON.parse(ctx.request.body)
    const claims = [creator.createSignedClaim({
      type: ClaimTypes.LICENSE,
      attributes: {
        [Fields.REFERENCE]: body.reference,
        [Fields.REFERENCE_OFFERING]: body.referenceOffering,
        [Fields.PROOF_TYPE]: "Bitcoin Transaction",
        [Fields.PROOF_VALUE]: JSON.stringify({
          txId: body.txId,
          ntxId: body.ntxId,
          outputIndex: body.outputIndex
        }),
        [Fields.REFERENCE_OWNER]: body.referenceOwner,
        [Fields.LICENSE_HOLDER]: body.owner
      }
    }, privKey)]
    await createBlock(claims, ctx)
  }))

  koa.use(Route.post('/claims', async (ctx: any) => {
    const sigs = JSON.parse(ctx.request.body).signatures

    const claims: ReadonlyArray<Claim> = sigs.map((sig: any) => {
      const claim = creator.serializedToClaim(
        new Buffer(new Buffer(sig.message, 'hex').toString(), 'hex')
      )
      claim.signature = sig.signature
      claim.id = new Buffer(creator.getId(claim)).toString('hex')
      return claim
    })

    const workClaims: ReadonlyArray<Claim> = claims.filter(_ => _.type === ClaimTypes.WORK)

    console.log('POST /claims', claims)

    // Hack to use the Work's signature for the Offering
    for (const claim of claims.filter(_ => _.type === ClaimTypes.OFFERING)) {
      const workClaim = workClaims && workClaims.length && workClaims[0]

      if (!workClaim)
        throw new Error(`Unsupported: an OFFERING claim was POSTed without any WORK claim`)

      claim.attributes = {
        ...claim.attributes,
        [Fields.REFERENCE]: workClaim.id
      }
    }

    const titleClaims: ReadonlyArray<Claim> = workClaims.map(claim =>
      creator.createSignedClaim({
        type: ClaimTypes.TITLE,
        attributes: {
          reference: claim.id,
          owner: claim.publicKey,
        }
      }, privKey)
    )

    const editWorkClaims = workClaims.filter(_ => _.attributes.supersedes)

    for (const claim of editWorkClaims) {
      // TODO: ideally, assert that claim.owner === claim.supersedes.owner
      // certification/work.ts has the final say on this

    }

    await createBlock([
      ...claims,
      ...titleClaims
    ], ctx)

  }))
  
  koa.use(Route.post('/v2/claims', async (ctx: any) => {
    const sigs = JSON.parse(ctx.request.body).claims

    const claims: ReadonlyArray<Claim> = sigs.map((sig: any) => {
      const claim = creator.serializedToClaim(
        new Buffer(sig.claim, 'hex')
      )
      claim.signature = sig.signature
      claim.id = new Buffer(creator.getId(claim)).toString('hex')
      return claim
    })

    const workClaims: ReadonlyArray<Claim> = claims.filter(_ => _.type === WORK)

    console.log('POST /claims', claims)
    const titleClaims: ReadonlyArray<Claim> = workClaims.map(claim =>
      creator.createSignedClaim({
        type: TITLE,
        attributes: {
          reference: claim.id,
          owner: claim.publicKey,
        }
      }, privKey)
    )

    await createBlock([
      ...claims,
      ...titleClaims
    ], ctx)

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
