import * as Koa from 'koa'
import { sha256 } from '../common'
import { Signature } from './interfaces'
import { doubleSha, verifies } from './helpers'
import { Queue } from '../notifications/queue';

const bitcore = require('bitcore-lib')
const uuid = require('uuid')
const Body = require('koa-body')
const Route = require('koa-route')
const IO = require('koa-socket')

export interface AuthServerOptions {
  port: number
}

export default async function createServer(options: AuthServerOptions) {

  const queue = new Queue()

  /**
   * We store a mapping from request id to websocket owning the request
   */
  const mappingToWebsocket = {} as any

  /**
   * Contains information about the request to sign, addressed by uuid
   */
  const requests = {} as any

  function makeRequest(id: string, payload: any, multiple: boolean, bitcoin: boolean,) {
    const signRequest = {
      id,
      multiple,
      bitcoin,
      url: `http://auth:5000/info/${id}`,
      message: payload,
      timestamp: new Date().getTime()
    }
    return JSON.stringify(signRequest)
  }

  function makeCreateResponse(payload: string, ref: string) {
    return JSON.stringify({
      status: "created",
      encoded: payload,
      ref
    })
  }

  function handleMultiple(websocket: any, messages: any) {

    const id = uuid.v4()
    const request = makeRequest(id, messages.payload, true, messages.bitcoin)
    const ref: string = messages.ref || ''

    requests[id] = request
    mappingToWebsocket[id] = websocket

    const notifyPubkey = messages.notifyPubkey
    if (notifyPubkey) {
      queue.publishNotification({ pubKey: notifyPubkey, requestId: id })
    }

    websocket.emit('message', makeCreateResponse(request, ref))
  }

  function handleAssociate(websocket: any, message: any) {
    const id = message.id
    mappingToWebsocket[id] = websocket
    return
  }

  function handleMessage(websocket: any, message: any) {
    if (message.type !== 'create') {
      websocket.emit('message', `{"error": "Unknown type of message ${message.type}"}`)
      return
    }

    if (!message.payload) {
      websocket.emit('message', `{"error": "Need a payload"}`)
      return
    }

    const id = uuid.v4()
    const request = makeRequest(id, message.payload, false, message.bitcoin)
    const ref: string = message.ref || ''

    requests[id] = request
    mappingToWebsocket[id] = websocket

    const notifyPubkey = message.notifyPubkey
    if (notifyPubkey) {
      queue.publishNotification({ pubKey: notifyPubkey, requestId: id })
    }

    websocket.emit('message', makeCreateResponse(request, ref))
  }

  function validSignatures(id: string, payload: Signature[]): boolean {
    const request = JSON.parse(requests[id])
    const verifyHash = request.bitcoin ? doubleSha : sha256
    for (var index in payload) {
      const encoded = new Buffer(request.message[index], 'hex')
      const signature = payload[index].signature
      const publicKey = payload[index].publicKey
      if (!verifies(verifyHash, encoded, signature, publicKey)) {
        return false
      }
    }

    return true
  }

  function validSignature(id: string, payload: Signature): boolean {
    const request = JSON.parse(requests[id])
    const encoded = new Buffer(request.message, 'hex')
    const signature = payload.signature
    const publicKey = payload.publicKey
    const verifyHash = request.bitcoin ? doubleSha : sha256

    if (!verifies(verifyHash, encoded, signature, publicKey)) {
      return false
    }
    return true
  }

  const koa = new Koa() as any

  const io = new IO()

  io.attach(koa)

  koa._io.on('connection', (socket: any) => {
    socket.on('request', async(msg: any) => {
      try {
        const payload = JSON.parse(msg)
        if (!payload.type) {
          socket.send('{"error": "Missing type on message"}')
        }
        if (payload.type === 'associate') {
          return handleAssociate(socket, payload)
        }
        if (payload.type === 'create') {
          return handleMessage(socket, payload)
        }
        if (payload.type === 'multiple') {
          return handleMultiple(socket, payload)
        }

      } catch (error) {
        console.log('Error creating request', error, error.stack)
      }
    })
    socket.emit('connected')
  })

  koa.use(Body())

  koa.use(Route.post('/request', async (ctx: any) => {
    const id = uuid.v4()
    const request = makeRequest(id, ctx.request.body, false, !!ctx.params.bitcoin)

    requests[id] = request

    const notifyPubkey = ctx.request.headers.get('x-notify-pubkey')
    if (notifyPubkey) {
      await queue.publishNotification({ pubKey: notifyPubkey, requestId: id })
    }

    ctx.response.body = id
  }))

  koa.use(Route.get('/request/:id', async (ctx: any, id: string) => {
    if (requests[id]) {
      ctx.response.body = requests[id]
    } else {
      ctx.response.status = 404
    }
  }))

  async function handleResponse(ctx: any, id: string) {
    const signature: Signature = await ctx.request.body

    console.log(signature)

    if (validSignature(id, signature)) {
      console.log('Accepted')
      ctx.response.body = '{"success": true}'
      if (mappingToWebsocket[id]) {
        mappingToWebsocket[id].send(JSON.stringify({
          id,
          request: requests[id],
          signature
        }))
      }
    } else {
      console.log('Rejected')
      ctx.response.body = '{"success": false}'
    }
  }

  async function handleMultipleResponse(ctx: any, id: string) {
    const signatures: Signature[] = await ctx.request.body

    console.log(signatures)

    if (validSignatures(id, signatures)) {
      console.log('Accepted')
      ctx.response.body = '{"success": true}'
      if (mappingToWebsocket[id]) {
        mappingToWebsocket[id].send(JSON.stringify({
          id,
          request: requests[id],
          signatures
        }))
      }
    } else {
      console.log('Rejected')
      ctx.response.body = '{"success": false}'
    }
  }

  koa.use(Route.post('/request/:id', handleResponse))

  koa.use(Route.post('/multiple/:id', handleMultipleResponse))

  koa.use(async (ctx: any, next: Function) => {
    try {
      await next()
    } catch (error) {
      console.log(`Error processing ${ctx.method} ${ctx.path}`, error, error.stack)
    }
  })

  return koa
}
