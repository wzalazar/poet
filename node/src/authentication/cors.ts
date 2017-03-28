// https://github.com/socketio/engine.io/issues/279#issuecomment-75195080
export default async function(ctx: any, next: Function) {
  const req = ctx.req
  const res = ctx.res
  console.log('Middleware', req.method, req.url)
  if (req.method === 'OPTIONS' && req.url.indexOf('/socket.io') === 0) {
    console.log('entered middleware')
    var headers: { [key: string]: any } = {}
    if (req.headers.origin) {
      headers['Access-Control-Allow-Credentials'] = 'true'
      headers['Access-Control-Allow-Origin'] = req.headers.origin
    } else {
      headers['Access-Control-Allow-Origin'] = '*'
    }

    headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE'
    headers['Access-Control-Allow-Headers'] = 'origin, content-type, accept'
    res.writeHead(200, headers)
    res.end()
  } else {
    console.log('skipped middleware')
    await next()
  }
}
