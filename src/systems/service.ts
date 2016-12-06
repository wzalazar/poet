import * as koa from 'koa'

const Webpack = require('koa-webpack')
const Body = require('koa-body')
const Socket = require('koa-socket')

const config = require('../web/webpack.config.js')

const app = new koa()
const webpack = new Webpack({ config })
const socket = new Socket()

socket.attach(app)

app.use(new Body())

socket.on('connection', (ctx: Object) => {
    console.log('connected', ctx)
})

app.use(webpack)

app.listen(3000)