const util = require('util');

const BadRequest = function (obj) {
	obj = obj || {};
	this.message = obj.message || 'bad request';
	this.status = obj.status || 400;
	return this;
}

const Unauthorized = function (obj) {
	obj = obj || {};
	this.message = obj.message || 'unauthorized';
	this.status = obj.status || 401;
	return this;
}

const Forbidden = function (obj) {
	obj = obj || {};
	this.message = obj.message || 'forbidden';
	this.status = obj.status || 403;
	return this;
}

const NotFound = function (obj) {
	obj = obj || {};
	this.message = obj.message || 'resource not found';
	this.status = obj.status || 404;
	return this;
}


util.inherits(BadRequest, Error);
util.inherits(Unauthorized, Error);
util.inherits(Forbidden, Error);
util.inherits(NotFound, Error);

exports.BadRequest = BadRequest;
exports.Unauthorized = Unauthorized;
exports.Forbidden = Forbidden;
exports.NotFound = NotFound;
