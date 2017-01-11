var _           = require('underscore');
var fs          = require('fs');
var config      = require('./config.json');
var mime        = require('mime-types');
var request     = require('request');
var colors      = require('colors');
var Client      = require('node-rest-client').Client;

var config      = require('./config.json');

var baseURL     = 'http://' + config.host + ':' + config.port;
var client      = new Client();

var urlExceptions       = config.exceptions.url;
var resourceExceptions  = config.exceptions.resources;


module.exports = {
  get: get,
  post: post,
  delete: del
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

function del(req, res) {

  client.delete(baseURL + req.url, {
    headers: { "Content-Type": "application/json" }
  }, function (data, response) {
    console.log(colors.red("DELETE   >", req.url));
    res.send(data);
  });
}

function get(req, res) {

  var url = matchURL(req.url);

  res.setHeader('content-type', mime.lookup(url));

  if (url.match(/http/)) {
    doRequest(req, res, url);
  } else {
    if(fs.existsSync(url)) {
      console.log(colors.green("PROXY  >", url));
      res.send(fs.readFileSync(url));
    } else {
      doRequest(req, res, baseURL + req.url);
    }
  }
}

function doRequest(req, res, url) {
  try {
    console.log(colors.cyan("URL    >", url));
    req.pipe(request(url)).pipe(res);
  } catch (err) {
    console.log(colors.red("ERR    >", err));
  }
}

function matchURL(url) {

  var isResourceException = _.find(resourceExceptions, function(exception){ if(url.match(/exception.match/)) return exception; });
  if(isResourceException) url = isResourceException.src;

  var mURL = baseURL + url;

  _.each(config.resources, function(resource){

    var isURLException = _.find(urlExceptions, function(exception){ return url.match(/exception/); });

    if(url.match(resource.match) && !isURLException) {
      mURL = resource.target + resource.path + url.split('/').slice(3, this.length).join('/');
    }
  });

  return mURL;
}
