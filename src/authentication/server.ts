import * as Koa from 'koa'
import { sha256, verify } from '../common'

const bitcore = require('bitcore-lib')
const uuid = require('uuid')
const Body = require('koa-body')
const Route = require('koa-route')
const IO = require('koa-socket')

interface AuthServerOptons {
  port: number
}

interface SignedMessage {
  encodedHash: string
  timestamp: number
  accept: boolean
  extra: string
}

interface Signature {
  signature: string
  publicKey: string
  message: string
}

export default async function createServer(options: AuthServerOptons) {

  /**
   * We store a mapping from request id to websocket owning the request
   */
  const mappingToWebsocket = {} as any

  /**
   * Contains information about the request to sign, addressed by uuid
   */
  const requests = {} as any

  function makeRequest(id: string, payload: any) {
    const signRequest = {
      id,
      url: `http://localhost:3000/info/${id}`,
      message: payload,
      timestamp: new Date().getTime()
    }
    const encoded = JSON.stringify(signRequest)
    return encoded
  }

  function makeCreateResponse(payload: string) {
    return JSON.stringify({
      status: "created",
      encoded: payload
    })
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
    const request = makeRequest(id, message.payload)

    requests[id] = request
    mappingToWebsocket[id] = websocket

    websocket.emit('message', makeCreateResponse(request))
  }

  function validSignature(id: string, payload: Signature): boolean {
    const encoded = requests[id]
    const signature = payload.signature
    const publicKey = payload.publicKey

    const message = JSON.parse(payload.message) as SignedMessage

    if (!encoded || !signature || !publicKey || !message) {
      return false
    }

    if (!message.encodedHash) {
      console.log('Must provide an encoded hash value')
      return false
    }
    if (!message.timestamp) {
      console.log('Must provide a timestamp')
      return false
    }
    if (message.accept === undefined) {
      console.log('Must provide an acceptance value')
      return false
    }

    if (message.encodedHash !== sha256(encoded).toString('hex')) {
      console.log('Signed message mismatch')
      return false
    }

    if (!verify(
        new bitcore.PublicKey(publicKey),
        new Buffer(signature, 'hex'),
        sha256(payload.message)))
    {
      console.log('Signature is invalid')
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

        handleMessage(socket, payload)
      } catch (error) {
        console.log('Error creating request', error, error.stack)
      }
    })
    socket.emit('connected')
  })

  koa.use(Body())

  koa.use(Route.get('/info/:id', async (ctx: any, id: string) => {
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
        mappingToWebsocket[id].send(JSON.stringify(signature))
      }
    } else {
      console.log('Rejected')
      ctx.response.body = '{"success": false}'
    }
  }

  koa.use(Route.post('/response/:id', handleResponse))

  koa.use(async (ctx: any, next: Function) => {
    try {
      await next()
    } catch (error) {
      console.log(`Error processing ${ctx.method} ${ctx.path}`, error, error.stack)
    }
  })

  return koa
}

export async function start(options: AuthServerOptons) {
  options = Object.assign({}, {
    port: 3000
  }, options || {})
  const server = await createServer(options)
  await server.listen(options.port)

  console.log('Server started successfully.')
}

if (!module.parent) {
  start({ port: 3000 }).catch(error => {
    console.log('Unable to start Trusted Publisher server:', error, error.stack)
  })
}
