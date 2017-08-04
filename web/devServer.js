const path = require('path')
const express = require('express')
const proxy = require('express-http-proxy');
const url = require('url');
const app = express();
const moment = require('moment')
const fetch = require('isomorphic-fetch')
const webpack = require('webpack')

const config = require('./webpack.config');

const compiler = webpack(config);

const webpackConfig = {
  noInfo: true,
  progress: true,
  publicPath: "/",
  stats: {
    colors: true
  },
  proxy: {
    '/api/explorer': {
      target: 'http://explorer:4000',
      secure: false
    },
    '/api/auth': {
      target: 'http://auth:5000',
      secure: false
    },
    '/api/user': {
      target: 'http://trusted-publisher:6000',
      secure: false
    },
    '/api/mockApp': {
      target: 'http://mock-signer:7000',
      secure: false
    }
  }
};

const btcmediaPubkey = '026e578f145bf43220e3b4faa03d4d57b80e703f96c17c34d85b214fdd9badc477'

app.use(require('webpack-dev-middleware')(compiler, webpackConfig));

app.use(require('webpack-hot-middleware')(compiler));

for (var proxyUrl in webpackConfig.proxy) {
  app.use(proxyUrl + '/*', proxy(webpackConfig.proxy[proxyUrl].target, {
    forwardPath: function(req, res) {
      return '/' + req.originalUrl.split('/').slice(3).join('/');
    }
  }));
}

app.get('/p/:id', function (req, res, next) {
  res.set('content-type','text/html');
  res.send(`<html><head><style> body,html,div { margin: 0; padding: 0 }</style><link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></head><body> <div style=" width: 165px; height: 50px; background-color: white; font-family: Roboto; font-size: 12px; border: 1px solid #CDCDCD; border-radius: 4px; box-shadow: 0 2px 0 0 #F0F0F0;"> <a href="https://alpha.po.et/l/${req.params.id}" target="_blank" style=" color: #35393E; text-decoration: none; display: flex; flex-direction: row;  height: 50px"> <img src="https://alpha.po.et/images/quill64.png" style=" width: 31px; height: 31px; margin-top: 8px; margin-left: 8px; margin-right: 8px; background-color: #393534; color: #35393E; font-family: Roboto;"> <div><p style="padding-top: 10px; line-height: 15px; margin: 0; font-size: 10pt; font-weight: bold; text-align: left;">Licensed via po.et</p><p style="text-align: left; line-height: 15px; margin: 0; font-size: 10px; padding-top: 1px; font-size: 8px; font-family: Roboto; font-weight: bold; line-height: 13px; color: #707070;">2017/03/22 at 16:12:11</p></div></a></div></body></html>`)
  res.end();
});


function returnEmptyPoet() {

  return `<html><head><style> body,html,div { margin: 0; padding: 0 }</style><link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></head>
<body> <div style=" width: 165px; height: 50px; background-color: white; font-family: Roboto; font-size: 12px; border: 1px solid #CDCDCD; border-radius: 4px; box-shadow: 0 2px 0 0 #F0F0F0;">
<a href="https://alpha.po.et/" target="_blank" style=" color: #35393E; text-decoration: none; display: flex; flex-direction: row;  height: 50px">
<img src="https://alpha.po.et/images/quill64.png" style=" width: 31px; height: 31px; margin-top: 8px; margin-left: 8px; margin-right: 8px; background-color: #393534; color: #35393E; font-family: Roboto;">
<div><p style="padding-top: 15px; line-height: 15px; margin: 0; font-size: 10pt; font-weight: bold; text-align: left;">Pending on po.et</p>
</div></a></div></body></html>`

}

function returnPoetLink(article) {

  return `
<html><head><style> body,html,div { margin: 0; padding: 0 }</style><link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></head>
<body> <div style=" width: 165px; height: 50px; background-color: white; font-family: Roboto; font-size: 12px; border: 1px solid #CDCDCD; border-radius: 4px; box-shadow: 0 2px 0 0 #F0F0F0;">
<a href="https://alpha.po.et/works/${article.id}" target="_blank" style=" color: #35393E; text-decoration: none; display: flex; flex-direction: row;  height: 50px">
 <img src="https://alpha.po.et/images/quill64.png" style=" width: 31px; height: 31px; margin-top: 8px; margin-left: 8px; margin-right: 8px; background-color: #393534; color: #35393E; font-family: Roboto;">
  <div><p style="padding-top: 10px; line-height: 15px; margin: 0; font-size: 10pt; font-weight: bold; text-align: left;">Verified on po.et</p>
  <p style="text-align: left; line-height: 15px; margin: 0; font-size: 10px; padding-top: 1px; font-size: 8px; font-family: Roboto; font-weight: bold; line-height: 13px; color: #707070;">${moment(parseInt(article.attributes.datePublished, 10)).format('MMMM Do YYYY, HH:mm')}</p>
  </div></a></div></body></html>`

}

app.get('/btcmag/:id', function (req, res, next) {
  fetch(`http://explorer:4000/works?attribute=id<>${req.params.id}&owner=${btcmediaPubkey}`)
    .then(res => res.json())
    .then((body) => {
      const response = body.length !== 1 ? returnEmptyPoet() : returnPoetLink(body[0])
      res.set('content-type','text/html');
      res.send(response)
      res.end();
    }).catch((err) => {
      console.log('Error btcmag magick')
      const response = returnEmptyPoet()
      res.set('content-type','text/html');
      res.send(response)
      res.end();
    })
});

app.get('/badge', function (req, res, next) {
  fetch(`http://explorer:4000/works?attribute=id<>${req.query.workId}&owner=${req.query.profileId}`)
    .then(res => res.json())
    .then((body) => {
      const response = body.length !== 1 ? returnEmptyPoet() : returnPoetLink(body[0])
      res.set('content-type','text/html');
      res.send(response)
      res.end();
    }).catch((err) => {
      console.log('Error with badge for', req.query.workId, req.query.profileId)
      const response = returnEmptyPoet()
      res.set('content-type','text/html');
      res.send(response)
      res.end();
    })
});

app.get('/s/:id', function (req, res, next) {
  res.set('content-type','text/html');
  res.send(`<html><head><style> body,html,div { margin: 0; padding: 0 }</style><link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></head><body> <div style=" width: 165px; height: 50px; background-color: white; font-family: Roboto; font-size: 12px; border: 1px solid #CDCDCD; border-radius: 4px; box-shadow: 0 2px 0 0 #F0F0F0;"> <a href="https://alpha.po.et/works/${req.params.id}" target="_blank" style=" color: #35393E; text-decoration: none; display: flex; flex-direction: row;  height: 50px"> <img src="https://alpha.po.et/images/quill64.png" style=" width: 31px; height: 31px; margin-top: 8px; margin-left: 8px; margin-right: 8px; background-color: #393534; color: #35393E; font-family: Roboto;"> <div><p style="padding-top: 10px; line-height: 15px; margin: 0; font-size: 10pt; font-weight: bold; text-align: left;">Licensed via po.et</p><p style="text-align: left; line-height: 15px; margin: 0; font-size: 10px; padding-top: 1px; font-size: 8px; font-family: Roboto; font-weight: bold; line-height: 13px; color: #707070;">2017/03/22 at 16:12:11</p></div></a></div></body></html>`)
  res.end();
});

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
