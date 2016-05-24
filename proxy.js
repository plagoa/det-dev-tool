var _         = require('underscore');
var request   = require('request');
var fs        = require('fs');
var mime      = require('mime-types');
var config    = require('./config.json');

module.exports = {
  parsePath: parsePath
}

function parsePath(req, res) {

  var requireCfg = parseRequireCfg(req, res);
  if(requireCfg) return null;

  var route = parseRoutes(req.url);
  if(route) return route;

  var resource = parseResources(req.url);
  if(resource) return resource;

  if(config.mock_data == "true" && /cxf/.test(req.url)) return parseMockData(req.url);

  return req.url;
}


function parseRoutes(url) {

  var data = null;

  _(config.routes).find(function(route){

    if(url == route.match) {

      var projectPath = config.projects[route.project];
      if(!projectPath) projectPath = "";

      if(route.redirect)
        data = { src: projectPath + route.redirect, type: "redirect"}

      if(route.send)
        data = { src: projectPath + route.send, type: "file"}
    }
  })

  return data;
}


function parseResources(url) {

  var data = null;

  _.each(config.resources, function(resource){

    var filePath = url.split('/').slice(resource.slice, this.length).join('/');
    var filter = new RegExp(resource.match);
    var projectPath = config.projects[resource.project];

    if(url.match(filter)) {
      data = { src: projectPath + resource.path + filePath, type: "file"}
    }
  })

  return data;
}


function parseRequireCfg(req, res) {

  var require = false;

  var filter = new RegExp('require-init');
  if(req.url.match(filter)) {

    request({
      url: 'http://' + config.pdi_host + ':' + config.pdi_port + req.url,
      method: 'GET',
    }, function (err, response, body) {
      if(err) return console.log(err);

      var s = body.search('/* Following');
      var e = body.search('requireCfg.baseUrl');
      var f = fs.readFileSync(config.projects['common-ui'] + '/package-res/resources/web/common-ui-require-js-cfg.js');
      var b = body.substr(0, s-2) + f.toString() + body.substr(e, body.length);

      res.setHeader('content-type', 'text/javascript');
      res.send(b);
    })

    require = true;
  }

  return require;
}


function parseMockData(url) {

  var data;
  var u = url.split('/');

  if(u[u.length-1] == 'dataSources') {

    data = [];

    fs.readdirSync('./mock_data').map(function (uuid) {
      var isHidden = /^\./.test(uuid);
      if(!isHidden) data.push(require('./mock_data/' + uuid + '/info.json'));
    });

  } else if(u[u.length-1] == 'data') {
    data = require('./mock_data/' + u[u.length-2] + '/data.json');
  } else {
    data = require('./mock_data/' + u[u.length-1] + '/info.json');
  }

  return { src: data, type: "content"};
}
