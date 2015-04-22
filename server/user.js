"use strict";

var _ = require('lodash');
var express = require('express');
var router = express.Router();

var users = require('./db/users');

router.get('/user', function(req, res) {
	res.send(req.session.user || req.user);
});

router.post('/user/signin', function(req, res) {
	var user = _.findWhere(users, {name: req.body.name});
	if(!user || user.password !== req.body.password)
		return res.status(401).send({error: 'Not authorised'});

	req.session.user = _.omit(user, 'password');
	res.send(req.session.user);
});

router.delete('/user/signin', function(req, res) {
	delete req.session.user;
	req.session.destroy();
	res.send({});
});

module.exports = router;
