const url = require('url');
var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//import { MongoClient } from 'mongodb';

var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var readstream = fs.createReadStream(__dirname + '/index.html', 'utf8');
    readstream.pipe(res);
});

server.listen(3000);
console.log('Listening to port 3000...');

/*
 * var url = "mongodb://locahost:27017/hypertube";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created");
    db.close();
}); */
