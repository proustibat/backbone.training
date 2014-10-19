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

router.delete('/musician/:id', function(req, res) {
	var musician = _.findWhere(musicians, {id: parseInt(req.params.id)});
	if(!musician)
		return res.status(404).send({error: 'No item found'});

	if(musicians.length === 1)
		return res.status(403).send({error: 'Last item protected'});

	musicians = _.without(musicians, musician);
	return res.send({});
});

module.exports = router;