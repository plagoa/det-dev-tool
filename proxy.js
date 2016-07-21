var _         = require('underscore');
var request   = require('request');
var fs        = require('fs');
var mime      = require('mime-types');
var config    = require('./config.json');

module.exports = {
  parseURL: parseURL
}

function parseURL(url) {

  var file = {src: url, type: 'url'};
  var path = url.split('/').slice(3, this.length).join('/');

  _.each(config.resources, function(resource){

    if(url.match(resource.match) && !url.match(/index.html/)) {
      file = {src: resource.project + resource.path + path, type: 'fs'};
    }
  });

  return file;
}
