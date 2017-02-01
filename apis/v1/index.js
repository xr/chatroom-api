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