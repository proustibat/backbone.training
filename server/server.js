"use strict";

var express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	authentication = require('./authentication'),
	passport = require('passport'),
	port = process.env.PORT || 3000;

var app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server);

require('./socket').io = io;

app
	.use(express.static(__dirname + '/../public'))
	.use(bodyParser.json({limit: '70mb'}))
	.use(session({secret: '1337', saveUninitialized: true, resave: true}))
	.use(passport.initialize())
	.use(passport.session())
	.use(require('./oauth'))
	.use(authentication)
	.use(require('./user'))
	.use(require('./musician'))
	.use(require('./picture'));

server.listen(port);
console.log('server is listening at ' + port);
