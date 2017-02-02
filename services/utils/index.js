const validator = require('validator')
	, ObjectId = require('mongoose').Types.ObjectId;

exports.isValidId = function (id) {
	return ObjectId.isValid(validator.toString(id));
}