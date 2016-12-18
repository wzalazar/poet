import * as koa from 'koa'

const Webpack = require('webpack')
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware')
const Body = require('koa-body')
const Socket = require('koa-socket')
const Logger = require('koa-logger')
const Route = require('koa-route')
const Router = require('koa-router')
const rewrite = require('koa-rewrite')
require('babel-polyfill')

const webpackConfig = require('../web/webpack.config')

const app = new koa()
app.use(Logger())

;
['block', 'claim', 'profile', 'settings', 'search', 'explorer',
 'portfolio'].forEach((name: string) => {
    app.use(rewrite(new RegExp('^\/' + name + '(.*)'), '/'))
})

const compiler = new Webpack(webpackConfig)
const dev = devMiddleware(compiler, {
  noinfo: true,
  headers: {
    'content-type': 'text/html'
  },
  stats: {
    colors: true
  }
})
app.use(dev)
app.use(hotMiddleware(compiler, {}))

const socket = new Socket()
socket.attach(app)

app.use(new Body())

socket.on('connection', (ctx: Object) => {
  console.log('client connected')
})

export default {
  app,
  compiler,
  io: app['io'],
  socket: app['_io']
}