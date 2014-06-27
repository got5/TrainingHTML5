var express = require('express');
var compression = require('compression');
var bodyParser= require('body-parser');
var methodOverride = require('method-override');

var app     = express();
var maxAge  = 31557600000;

app.use(compression());
//app.use(bodyParser.json());
//app.use(express.methodOverride());
app.use(express.static(__dirname + '/app' ));

app.get('/*', function(req,res)
{
    res.sendfile(__dirname + '/app/index.html');
});

app.listen(3002);

console.log('Listening on port 3002');
