const User = require('./models/users')
	, validator = require('validator')
	, cError = require('../error')	
	, utils = require('../utils')
	, Auth = require('../auth')
	, UserModel = User.Model;

/**
 * find user or create if not exist
 * @param {object} opts
 * @return {document} newly created or existed user entity
 */
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

/**
 * get user details
 * @param {object} opts
 * @return {document} existed user entity
 */
exports.find = function *(opts) {

	if (!utils.isValidId(opts.id)) {
		throw new cError.BadRequest({
			message: 'invalid user id'
		});	
	}

	let user = yield UserModel.findOne({
		_id: opts.id
	}).exec();

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