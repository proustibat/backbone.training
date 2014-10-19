"use strict";

var express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	authentication = require('./authentication');

var app = express();
app
	.use(express.static(__dirname + '/../public'))
	.use(bodyParser.json({limit: '70mb'}))
	.use(session({secret: '1337', saveUninitialized: true, resave: true}))
	// .use(authentication)
	.use(require('./user'))
	.use(require('./musician'))
	.use(require('./picture'))
	.listen(3000);

console.log('server is listening at 3000');