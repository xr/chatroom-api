/**
 *
 * REST API handler
 * @module RESTAPI:API-v1
 *
 */
'use strict';

// needed API libraries
const Router = require('koa-router');

// load API config & related services


// initialize
const API = new Router();
exports = module.exports = API;

// register services
const RoomAPI = require('../../services/room/api');

/**
 * GET /rooms
 * Return a list of rooms.
 * @return {JSON string} [rooms as JSON collections]
 */
API.get('/rooms', function *() {
	this.body = yield RoomAPI.getRooms();
});

/**
 * POST /rooms
 * Create a new room
 * @return {JSON string} [newly created room]
 */
API.post('/rooms', function *() {
	let content = this.request.body;
	try {
		this.body = yield RoomAPI.createRoom({
		}, content);
	} catch (e) {
		// TODO: better error handling
		console.error(e);
	}
});