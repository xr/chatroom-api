/**
 *
 * REST API handler
 * @module RESTAPI:API-v1
 *
 */
'use strict';

// needed API libraries
const Router = require('koa-router')
	, passport = require('koa-passport');

// load API config & related services
const Auth = require('../../services/auth')
	, config = require('../../config');


// initialize
const API = new Router();

exports = module.exports = API;

// register services
const RoomAPI = require('../../services/room/api');

/*===========================================
=            Authentication Part            =
===========================================*/

API.get('/auth/:mode', function *() {
	yield passport.authenticate(this.params.mode);
});

API.get('/auth/:mode/callback', function *() {
	yield passport.authenticate(this.params.mode, {
		successRedirect: config.app.url,
		failureRedirect: `${config.app.url}/login?error=1`
	});
});



/*=======================================
=            Rooms Endpoints            =
=======================================*/

/**
 * GET /rooms
 * Return a list of rooms.
 * @return {JSON string} [rooms as JSON collections]
 */
API.get('/rooms', function *() {
	this.body = yield RoomAPI.get();
});

/**
 * POST /rooms
 * Create a new room
 * @return {JSON string} [newly created room]
 */
API.post('/rooms', function *() {
	let content = this.request.body;
	this.body = yield RoomAPI.upsert({}, content);
});