var express = require("express");
var app = express();
var gm = require("gm");
var HashMap = require("hashmap");
var sessions = new HashMap();

var start = require("./start")(app, sessions);
var imgs = require("./images")(app, sessions);
var collage = require("./collage.js")(app, sessions, gm);

app.listen(3000);
app.use(express.static(__dirname + '/HTML'));
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));
app.use('/js', express.static('js'));
//Store all HTML files in view folder.
//app.use(express.static(__dirname + '/Script'));
//Store all JS and CSS in Scripts folder.

app.get('/', function (req, res) {
    res.sendFile('/index.html');
});


console.log("Application now listening on port 3000");
