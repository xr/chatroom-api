/**
 * 
 * Message sub-service API to external entities
 * @module Room:API
 * 
 */
'use strict';

const validator = require('validator')
	, Message = require('./models/messages')
	, cError = require('../error')
	, utils = require('../utils')
	, MessageModel = Message.Model;


exports.find = function *(opts) {
	// todo
};

exports.upsert = function *(opts, fields) {
	// authentication check
	if (!opts.auth_user) {
		throw new cError.Unauthorized();
	}

	let message
		,data = {};

	if (opts.id) {
		//TODO if edit messages functionality required
		
	} else {
		// create
		if (!fields.rid || validator.isEmpty(fields.content)) {
			throw new cError.BadRequest({ message: 'missing fields: rid or content.' });
		}

		// TODO: also need to check if the room exisits
		if (!utils.isValidId(fields.rid)) {
			throw new cError.BadRequest({ message: 'rid field incorrect format.' });
		}

		data.content = validator.escape(validator.trim(fields.content));
		data.from = opts.auth_user._id;
		data.rid = fields.rid;
		message = new MessageModel(data);
	}

	return yield message.save();
}
