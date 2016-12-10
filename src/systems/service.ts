import * as koa from 'koa'


const Webpack = require('webpack')
const webpackMiddleware = require('koa-webpack')
const Body = require('koa-body')
const Socket = require('koa-socket')
const Logger = require('koa-logger')
const Route = require('koa-route')
const rewrite = require('koa-rewrite')

const config = require('../web/webpack.config')

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
 '1551': { id: '1551', type: 'Profile', publicKey: "03", attributes: {name: "First Notary", contactInfo: "notary@po.et" } }
}
const title = {
  '1111': { id: '1221', type: 'Title', publicKey: '02', attributes: { for: "1111", owner: "02" } }
}
const profile = {
  '02': claims[2],
  '03': claims[4]
}
const blocks = {
  '5555': {
    id: '5555',
    bitcoinBlock: 'fabc',
    bitcoinTransaction: '0123',
    bitcoinBlockOrder: 430000,
    transactionOrder: 300,
    outputOrder: 3,
    claims: [ claims[0], claims[1] ]
  },
  '6666': {
    id: '6666',
    bitcoinBlock: 'fabc',
    bitcoinTransaction: '0123',
    bitcoinBlockOrder: 430002,
    transactionOrder: 300,
    outputOrder: 2,
    claims: [ claims[2] ]
  },
  '7777': {
    id: '7777',
    bitcoinBlock: 'fabc',
    bitcoinTransaction: '0123',
    bitcoinBlockOrder: 430050,
    transactionOrder: 200,
    outputOrder: 1,
    claims: [ claims[3], claims[4] ]
  }
}

app.use(Route.get('/api/search/:query', (ctx, next) => {
  ctx.body = JSON.stringify([claims[1], claims[0], claims[3]])
}))
app.use(Route.get('/api/claim/:id', (ctx, next) => {
  ctx.body = JSON.stringify(claims[ctx.params.id])
}))
app.use(Route.get('/api/titleFor/:id', (ctx, next) => {
  ctx.body = JSON.stringify(title[ctx.params.id])
}))
app.use(Route.get('/api/profileFor/:id', (ctx, next) => {
  ctx.body = JSON.stringify(profile[ctx.params.id])
}))
app.use(Route.get('/api/claim/:id', (ctx, next) => {
  ctx.body = JSON.stringify(claims[ctx.params.id])
}))
app.use(Route.get('/api/block/:id', (ctx, next) => {
  ctx.body = JSON.stringify(blocks[ctx.params.id])
}))
app.use(Route.get('/api/all_blocks', (ctx, next) => {
  ctx.body = JSON.stringify(Object.keys(blocks).map(key => blocks[key]))
}))

export default {
  app,
  compiler,
  io: app['io'],
  socket: app['_io']
}