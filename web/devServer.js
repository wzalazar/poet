const path = require('path')
const express = require('express')
const proxy = require('express-http-proxy');
const url = require('url');
const app = express();

const webpack = require('webpack')
const config = require('./webpack.config');

const compiler = webpack(config);

const SERVER = process.env.SERVER || 'poet.host'

const webpackConfig = {
  noInfo: true,
  progress: true,
  publicPath: "/",
  stats: {
    colors: true
  },
  proxy: {
    '/api/explorer': {
      target: 'http://' + SERVER + ':4000',
      secure: false
    },
    '/api/auth': {
      target: 'http://' + SERVER + ':5000',
      secure: false
    },
    '/api/user': {
      target: 'http://' + SERVER + ':6000',
      secure: false
    },
    '/api/mockApp': {
      target: 'http://' + SERVER + ':7000',
      secure: false
    }
  }
};

app.use(require('webpack-dev-middleware')(compiler, webpackConfig));

app.use(require('webpack-hot-middleware')(compiler));

for (var proxyUrl in webpackConfig.proxy) {
  app.use(proxyUrl + '/*', proxy(webpackConfig.proxy[proxyUrl].target, {
    forwardPath: function(req, res) {
      return '/' + req.originalUrl.split('/').slice(3).join('/');
    }
  }));
}

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