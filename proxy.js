var _         = require('underscore');
var request   = require('request');
var fs        = require('fs');
var mime      = require('mime-types');
var config    = require('./config.json');

module.exports = {
  parsePath: function(req, res) {

    var resource = parseResources(req.url);
    if(resource) return resource;

    return req.url;
  }
}

function parseResources(url) {

  var file = null;
  var filePath = url.split('/').slice(3, this.length).join('/');

  _.each(config.resources, function(resource){

    var filter = new RegExp(resource.match);
    var projectPath = resource.project;

    if(url.match(filter) && !url.match(/index.html/)) {
      file = projectPath + resource.path + filePath;
    }
  });

  if(file) console.log("PROXY  - " + url + "\n       - " + file);

  return file;
}
