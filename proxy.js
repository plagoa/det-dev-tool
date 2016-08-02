var _         = require('underscore');
var request   = require('request');
var fs        = require('fs');
var mime      = require('mime-types');
var config    = require('./config.json');

var exceptions = [/index.html/, /\.(jpe?g|png|gif|bmp|svg)$/i]

module.exports = {
  parseURL: parseURL
}

function parseURL(url) {

  var file = {src: url, type: 'url'};
  var path = url.split('/').slice(3, this.length).join('/');

  _.each(config.resources, function(resource){

    var isException = false;
    _.each(exceptions, function(exception){
      if(url.match(exception)) isException = true;
    })

    if(url.match(resource.match) && !isException) {
      file = {src: resource.project + resource.path + path, type: 'fs'};
    }
  });

  return file;
}
