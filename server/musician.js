"use strict";

var _ = require('lodash');
var express = require('express');
var musicians = require('./db/musicians.json');

var router = express.Router();

router.get('/musician', function(req, res) {
	res.send(musicians);
});

router.post('/musician', function(req, res) {
	var musician = _.extend({id: musicians.length}, _.pick(req.body, 'name', 'bio', 'picture'));
	musicians.push(musician);
	_.delay(function() {
		res.send(musician);	
	}, 1000);
});

router.put('/musician/:id', function(req, res) {
	var musician = _.findWhere(musicians, {id: parseInt(req.params.id)});
	if(!musician)
		return res.status(404).send({error: 'No item found'});

	_.extend(musician, _.pick(req.body, 'name', 'bio', 'picture'));
	res.send(musician);
});

router.delete('/musician/:id', function(req, res) {
	var musician = _.findWhere(musicians, {id: parseInt(req.params.id)});
	if(!musician)
		return res.status(404).send({error: 'No item found'});

	if(musicians.length === 1)
		return res.status(403).send({error: 'Last item protected'});

	musicians = _.without(musicians, musician);
	return res.send({});
});

var sockets = [];

setInterval(function() {
	var index = _.random(0, musicians.length-1),
		musician = musicians[index];

	musician.fame ? musician.fame++ : musician.fame = 1;

	sockets.forEach(function(socket) {
		socket.emit('musician', musician);
	});
}, 300);

var io = require('./socket').io;
io.on('connection', function(socket) {
	sockets.push(socket);
	socket.on('fame', function(id) {
		var musician = _.findWhere(musicians, {id: id});
		if(musician) {
			musician.fame ? musician.fame++ : musician.fame = 1;
			this.emit('musician', musician);
		}
	});
});

module.exports = router;
