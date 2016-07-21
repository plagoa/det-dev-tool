var express   = require('express');
var request   = require('request');
var fs        = require('fs');
var mime      = require('mime-types');
var colors    = require('colors');
var config    = require('./config.json');
var proxy     = require('./proxy');
var app       = express();

var port      = process.env.PORT || 3000;
var baseUrl   = 'http://' + config.host + ':' + config.port;

app.get("/*", function(req, res){

  var file = proxy.parseURL(req.url);
  load(file, res);
})

app.listen(port, function(){
  console.log('App listening on port ' + port + '!');
});

function load(file, res) {

  res.setHeader('content-type', mime.lookup(file.src));

  if (file.type == 'fs') {
    res.send(fs.readFileSync(file.src));
    console.log(colors.green("PROXY  >", file.src));
  }

  if (file.type == 'url') {
    request({
      url: baseUrl + file.src,
      method: 'GET',
    }, function (err, response, body) {
      if(err) return console.log(err);
      res.send(body);
    })
    console.log(colors.cyan("URL    >", baseUrl + file.src));
  }
}
