var express = require("express"),
    app     = express(),
    port    = 1337;

var pins = [
  {
    title: "Lille", 
    path: "images/lille1", 
    user: "Worldline", 
    board: "Place to be"
  },
  {
    title: "Lille 2", 
    path: "images/lille2", 
    user: "Worldline", 
    board: "Place to be"
  },
  {
    title: "Lille 3", 
    path: "images/lille3", 
    user: "Worldline", 
    board: "Place to be"
  },
  {
    title: "Lille 4", 
    path: "images/lille4", 
    user: "Worldline", 
    board: "Place to be"
  }, 
]; 

var user = {
  login : "Worldline", 
  board : ["Lille", "HTML5", "jQuery"], 
  numberOfPin : 200, 
  numberOfAbonne : 42
};


app.get("/", function(req, res) {
  res.redirect("/index.html");
});

app.get("/pins", function(req, res) {
  res.json(pins)
});

app.get("/user", function(req, res) {
  res.json(users)
});

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({
    dumpExceptions: true, 
    showStack: true
  }));
  app.use(app.router);
});

app.listen(port);
