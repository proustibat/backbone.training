"use strict";

var _ = require('lodash');
var express = require('express');
var pictures = require('./db/pictures.json');

var router = express.Router();

router.get('/picture', function(req, res) {
	res.send(pictures);
});

module.exports = router;