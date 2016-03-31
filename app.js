var app = require("express")();
var gm = require("gm");
var HashMap = require("hashmap");
var sessions = new HashMap();

var start = require("./start")(app, sessions);
var imgs = require("./images")(app, sessions);
var collage = require("./collage.js")(app, sessions, gm);

app.listen(3000);
console.log("Application now listening on port 3000");