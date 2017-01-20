const path = require('path')
const express = require('express')
const proxy = require('express-http-proxy');
const url = require('url');
const app = express();

const webpack = require('webpack')
const config = require('./webpack.config');

const compiler = webpack(config);

const SERVER = '192.168.0.168'

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  progress: true,
  publicPath: "/",
  stats: {
    colors: true
  },
  proxy: {
    '/api/explorer': {
      target: 'http://192.168.0.168:4000/',
      secure: false
    },
    '/api/user': {
      target: 'http://192.168.0.168:3000/',
      secure: false
    }
  }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/api/explorer/*', proxy(SERVER + ':4000', {
  forwardPath: function(req, res) {
    return '/' + req.originalUrl.split('/').slice(3).join('/');
  }
}));
app.use('/api/user/*', proxy(SERVER + ':3000', {
  forwardPath: function(req, res) {
    return '/' + req.originalUrl.split('/').slice(3).join('/');
  }
}));

app.use('*', function (req, res, next) {
  var filename = path.join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, function(err, result){
    if (err) {
      return next(err);
    }
    res.set('content-type','text/html');
    res.send(result);
    res.end();
  });
});

app.listen(3000, '0.0.0.0', function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});