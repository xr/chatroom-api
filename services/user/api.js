const User = require('./models/users')
	, validator = require('validator')
	, cError = require('../error')	
	, utils = require('../utils')
	, Auth = require('../auth')
	, UserModel = User.Model;

exports.findOrCreate = function *(opts) {
	let user;

	let exists = yield UserModel.findOne({
		'fbid': opts.id
	}).exec();

	if (exists) {
		return exists;
	} else {
		user = new UserModel();
		user.name = validator.trim(opts.displayName || opts.username);
		user.fbid = opts.id;
	}

	let res = yield user.save();
	return res;
};

exports.update = function *(opts, fields) {
	// authentication check
	if (!opts.auth_user) {
		throw new cError.Unauthorized();
	}
	
	let user;

	if (!utils.isValidId(opts.id)) {
		throw new cError.BadRequest({
			message: 'Invalid user id'
		});
	}

	user = yield UserModel.findOne({ _id: opts.id }).exec();

	if (!user) {
		throw new cError.NotFound({ message: 'user does not exist' })
	}

	if ((opts.id.toString() === opts.auth_user._id.toString()) || Auth.isAdmin(opts.auth_user.id)) {
		if (fields.name) {
			user.name = fields.name;
		}
		if (fields.sign) {
			user.sign = fields.sign;
		}
		if (fields.rid) {
			user.rooms.push(fields.rid);
		}
		user.updated = Date.now();
	} else {
		throw new cError.Forbidden({ message: 'you do not have right to modify this user' });
	}

	return yield user.save();
};

exports.find = function *(opts) {

	if (!utils.isValidId(opts.id)) {
		throw new cError.BadRequest({
			message: 'invalid user id'
		});	
	}

	let user = yield UserModel.findOne({
		_id: opts.id
	}).exec();

	if (!user) {
		throw new cError.NotFound({
			message: 'user does not exist'
		});
	}

	return user;
}

exports.remove = function *(opts) {
	if (!opts.auth_user) {
		throw new cError.Unauthorized();
	}

	if (!utils.isValidId(opts.id)) {
		throw new cError.BadRequest({
			message: 'invalid user id'
		});	
	}

	if (!Auth.isAdmin(opts.auth_user._id.toString())) {
		throw new cError.Forbidden();
	}

	let user = yield UserModel.remove({
		_id: opts.id
	}).exec();

	return user;
}