import * as koa from 'koa'


const Webpack = require('webpack')
const webpackMiddleware = require('koa-webpack')
const Body = require('koa-body')
const Socket = require('koa-socket')
const Logger = require('koa-logger')
const Route = require('koa-route')
const Router = require('koa-router')
const rewrite = require('koa-rewrite')

const config = require('../web/webpack.config')

const api = Router({
  prefix: '/api'
})

const app = new koa()
app.use(Logger())

;
['block', 'claim', 'profile', 'settings', 'search', 'explorer',
 'portfolio'].forEach((name: string) => {
    app.use(rewrite(new RegExp('^\/' + name + '(.*)'), '/'))
})

const compiler = new Webpack(config)
const webpack = webpackMiddleware({
  compiler,
  dev: {
      hot: true,
      inline: true
  }
})
app.use(webpack)

const socket = new Socket()
socket.attach(app)

app.use(new Body())

socket.on('connection', (ctx: Object) => {
  console.log('client connected')
})

const claims = {
 '1111': { id: '1111', type: 'CreativeWork', publicKey: '01', attributes: { name: "Mona Lisa" } },
 '1221': { id: '1221', type: 'Title', publicKey: '02', attributes: { for: "1111", owner: "02" } },
 '1331': { id: '1331', type: 'Profile', publicKey: "02", attributes: { "name": "John Doe", "contactInfo": "john@doe.com" } },
 '1441': { id: '1441', type: 'Certificate', publicKey: "03", attributes: { for: "1221" } },
 '1551': { id: '1551', type: 'Profile', publicKey: "03", attributes: {name: "First Notary", contactInfo: "notary@po.et" } },
 '1666': { id: '1661', type: 'Profile', publicKey: "01", attributes: {name: "Random User", contactInfo: "user@po.et" } }
}
const title = {
  '1111': { id: '1221', type: 'Title', publicKey: '02', attributes: { for: "1111", owner: "02" } }
}
const profile = {
  '01': claims['1661'],
  '02': claims['1331'],
  '03': claims['1551']
}
const blocks = {
  '5555': {
    id: '5555',
    bitcoinBlock: 'fabc',
    bitcoinTransaction: '0123',
    bitcoinBlockOrder: 430000,
    transactionOrder: 300,
    outputOrder: 3,
    claims: [ claims['1221'], claims['1331'] ]
  },
  '6666': {
    id: '6666',
    bitcoinBlock: 'fabc',
    bitcoinTransaction: '0123',
    bitcoinBlockOrder: 430002,
    transactionOrder: 300,
    outputOrder: 2,
    claims: [ claims['1441'] ]
  },
  '7777': {
    id: '7777',
    bitcoinBlock: 'fabc',
    bitcoinTransaction: '0123',
    bitcoinBlockOrder: 430050,
    transactionOrder: 200,
    outputOrder: 1,
    claims: [ claims['1111'], claims['1551'] ]
  }
}

api.get('/search/:query', async (ctx, next) => {
    ctx.body = JSON.stringify([claims['1111'], claims['1331'], claims['1551']])
  })
  .get('/claim/:id', async (ctx, next) => {
    ctx.body = JSON.stringify(claims[ctx.params.id])
  })
  .get('/titleFor/:id', async (ctx, next) => {
    ctx.body = JSON.stringify(title[ctx.params.id])
  })
  .get('/profileByPublicKey/:id', async (ctx, next) => {
    ctx.body = JSON.stringify(profile[ctx.params.id])
  })
  .get('/issuerFor/:id', async (ctx, next) => {
    const profileClaim = profile[claims[ctx.params.id].publicKey]
    if (!profileClaim) {
      this.status = 404
      return
    }
    ctx.body = JSON.stringify(profileClaim)
  })
  .get('/ownerFor/:id', async (ctx, next) => {
    const titleClaim = title[ctx.params.id]
    if (!titleClaim) {
      this.status = 404
      return
    }
    const profileClaim = profile[titleClaim.attributes.owner]
    if (!profileClaim) {
      this.status = 404
      return
    }
    ctx.body = JSON.stringify(profileClaim)
  })
  .get('/claim/:id', async (ctx, next) => {
    ctx.body = JSON.stringify(claims[ctx.params.id])
  })
  .get('/block/:id', async (ctx, next) => {
    ctx.body = JSON.stringify(blocks[ctx.params.id])
  })
  .get('/all_blocks', async (ctx, next) => {
    ctx.body = JSON.stringify(Object.keys(blocks).map(key => blocks[key]))
  })

app.use(api.routes())
app.use(api.allowedMethods())

export default {
  app,
  compiler,
  io: app['io'],
  socket: app['_io']
}