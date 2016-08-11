var express     = require('express');
var bodyParser  = require('body-parser');
var proxy       = require('./proxy');
var request     = require('request');

var port        = process.env.PORT || 3000;

var app         = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.all("/*", function(req, res){
  proxy.proxyRequest(req, res);
})

app.listen(port, function(){
  console.log('App listening on port ' + port + '!');
});
