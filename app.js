var express = require("express");
var parser = require("body-parser");
var app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

var gm = require("gm");
var HashMap = require("hashmap");
var sessions = new HashMap();

app.post("/images", function(req, res)
{
	console.log(req.body);
	console.log(req.test);
	res.send("OK");
});

/*var start = require("./start")(app, sessions);
var imgs = require("./images")(app, sessions);
var collage = require("./collage.js")(app, sessions, gm);*/

app.listen(3000);
console.log("Application now listening on port 3000");