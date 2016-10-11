var express     = require('express');
var bodyParser  = require('body-parser');
var proxy       = require('./proxy');

var port        = process.env.PORT || 3000;
var app         = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.listen(port, function(){
  console.log('App listening on port ' + port + '!');
});

app.get("/*", function(req, res){
  proxy.get(req, res);
})

app.post("/*", function(req, res){
  proxy.post(req, res);
})

app.delete("/*", function(req, res){
  proxy.delete(req, res);
})
