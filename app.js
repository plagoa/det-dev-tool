var express   = require('express');
var request   = require('request');
var fs        = require('fs');
var mime      = require('mime-types');
var config    = require('./config.json');
var proxy     = require('./proxy');
var app       = express();

var port      = process.env.PORT || 3000;
var baseUrl   = 'http://' + config.host + ':' + config.port;

app.get("/*", function(req, res){

  var data = proxy.parsePath(req, res);
  if(data) load(data, req, res);
})

app.listen(port, function(){
  console.log('App listening on port ' + port + '!');
});


function load(data, req, res) {

  var type = data.hasOwnProperty('type') ? data.type : null;
  var src = data.hasOwnProperty('src') ? data.src : data;

  if (type && type == 'content') {
    res.send(src);
    return;
  }

  res.setHeader('content-type', mime.lookup(src));

  if (type && type == 'file') {
    res.send(fs.readFileSync(src));
    return;
  }

  console.log("URL    - ", src);

  request({
    url: baseUrl + src,
    method: 'GET',
  }, function (err, response, body) {
    if(err) return console.log(err);
    res.send(body);
  })
}
