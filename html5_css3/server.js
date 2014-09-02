var express = require('express');
var app     = express();

app.use(express.static(__dirname + '/app' ));




app.get('/*', function(req,res)
{
    res.sendfile(__dirname + '/app/index.html');
});

/*app.get("/manifest.appcache", function(req, res){
    res.header("Content-Type", "text/cache-manifest");
    res.end("CACHE MANIFEST");
});*/

app.listen(3002);

console.log('Listening on port 3002');
