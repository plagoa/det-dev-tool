var _           = require('underscore');
var fs          = require('fs');
var config      = require('./config.json');
var mime        = require('mime-types');
var request     = require('request');
var colors      = require('colors');
var Client      = require('node-rest-client').Client;

var config      = require('./config.json');
var exceptions  = [/index.html/, /\.(jpe?g|png|gif|bmp|svg)$/i];
var baseURL     = 'http://' + config.host + ':' + config.port;
var client      = new Client();


module.exports = {
  proxyRequest: proxyRequest
}

function proxyRequest(req, res) {

  switch (req.method) {
    case "POST":
      post(req, res);
      break;
    case "GET":
      get(req, res);
      break;
  }
}

function post(req, res) {

  client.post(baseURL + req.url, {
    data: req.body,
    headers: { "Content-Type": "application/json" }
  }, function (data, response) {
    console.log(colors.yellow("POST   >", req.url));
    res.send(data);
  });
}

function get(req, res) {

  var url = matchURL(req.url);

  res.setHeader('content-type', mime.lookup(url));

  if (url.match(/http/)) {
    console.log(colors.cyan("URL    >", url));
    req.pipe(request(url)).pipe(res);
  } else {
    console.log(colors.green("PROXY  >", url));
    res.send(fs.readFileSync(url));
  }
}

function matchURL(url) {

  var mURL = baseURL + url;

  _.each(config.resources, function(resource){

    if(url.match(resource.match) && !isException(mURL)) {
      mURL = resource.target + resource.path + url.split('/').slice(3, this.length).join('/');
    }
  });

  return mURL;
}

function isException(url) {

  var isException;

  _.each(exceptions, function(exception){
    if(url.match(exception)) isException = true;
  })

  return isException;
}
