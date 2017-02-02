/**
 * 
 * Room sub-service API to external entities
 * @module Room:API
 * 
 */
'use strict';

const validator = require('validator')
	, Room = require('./models/rooms')
	, cError = require('../error')
	, RoomModel = Room.Model;

/**
 * get Rooms or room if provide id
 * @param {object} opts
 * @return {collections} or {document}
 */
exports.get = function *(opts) {
	return [{
		'name': 'test1'
	}, {
		'name': 'test2'
	}];
};

/**
 * create a new room or update one
 * @param {object} opts
 * @param {object} fields
 * @return {document}
 */
exports.upsert = function *(opts, fields) {
	let res;
	let errMsg;
	let data = {};

	if (fields.title) {
		data.title = validator.escape(validator.trim(fields.title));
		if (validator.isEmpty(data.title)) {
			errMsg = 'You must give a title';
		}
	}

	if (fields.desc) {
		data.desc = validator.escape(validator.trim(fields.desc));
	}

	if (errMsg) throw new cError.BadRequest({ message: errMsg });

	if (opts.id) {
		// update
	} else {
		let room = new RoomModel(data);
		res = yield room.save();
	}

	return res;
}
