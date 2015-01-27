"use strict";

module.exports = function(req, res, next) {
	if(req.method === 'GET' && req.path !== '/user')
		|| (req.method === 'POST' && req.path === '/user/signin'))
		return next();

	var user = req.session.user;
	if(!user)
		return res.status(401).send({error: 'Not authorised'});

	next();
};