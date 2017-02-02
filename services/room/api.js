/**
 * 
 * Room sub-service API to external entities
 * @module Room:API
 * 
 */
'use strict';

const mongoose = require('mongoose')
	, validator = require('validator');

const Room = require('./models/rooms')
	, cError = require('../error');

/**
 * get Rooms
 * @param {object} opts
 * @return {collections}
 */
exports.getRooms = function *(opts) {
	return [{
		'name': 'test1'
	}, {
		'name': 'test2'
	}];
};

/**
 * create a new room
 * @param {object} opts
 * @param {object} fields
 * @return {document}
 */
exports.createRoom = function *(opts, fields) {
	let data = {};

	data.title = validator.trim(fields.title);
	data.desc = validator.trim(fields.desc);

	// validate
	let editError;
	if (data.title === '') {
		editError = 'You must give a title';
	}

	if (editError) {
		// TODO: handle error nicely
	}

	let room = new Room.Model(data);
	let res = yield room.save();
	return res;
}
