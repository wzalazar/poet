import * as koa from 'koa'
import * as Body from 'koa-body'
import * as Socket from 'koa-socket'
import * as Logger from 'koa-logger'

const app = new koa()
app.use(Logger())
app.use(Body())

const socket = new Socket()
socket.attach(app)

socket.on('connection', (ctx: Object) => {
  console.log('client connected')
})

export default {
  app,
  io: app['io'],
  socket: app['_io']
}
