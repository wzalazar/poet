import * as koa from 'koa'


const Webpack = require('webpack')
const webpackMiddleware = require('koa-webpack')
const Body = require('koa-body')
const Socket = require('koa-socket')

const config = require('../web/webpack.config')

const app = new koa()
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
    console.log('connected', ctx)
})

app.listen(3000)