/**
 *
 * REST API HTTP-server
 * @module RESTAPI:HTTP-server
 *
 */
'use strict';

const config = require('./config')
	, path = require('path')
	, mount = require('koa-mount')
	, bodyparser = require('koa-bodyparser')
	, passport = require('koa-passport')
	, mongoose = require("mongoose")
	, session = require('koa-session')
	, koa = require('koa')
	, api = require('./apis')
	, app = koa();


mongoose.connect(config.mongo.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, '[DATABASE] MongoDB connection error:'));
db.once('open', function callback () {
  console.info('[DATABASE] MongoDB connected');
});

/**
 * @name response time counter
 */
app.use(function *(next){
	let start = new Date;
	yield next;
	let ms = new Date - start;
	this.set('X-Response-Time', ms + 'ms');
});

app.keys = config.server.secrets;


/**
 * @name resolve form or JSON paramter into JS object
 */
app.use(bodyparser());

app.use(session(app));
app.use(passport.initialize());
app.use(passport.session());

/**
 * @name server error handler
 */
app.use(function *(next) {
	try {
		yield next;
	} catch (err) {
		this.status = err.status || 500;
		this.body = {
			"status": 'error',
			"message": err.message
		};
		console.warn(`[HTTP REST server] app error: ${this.status} ${this.request.method} ${this.request.url} ${this.body.message}`);
  	}
});

/**
 * @name APIs mounting
 */
for (let a in api) {
	let route = path.join(config.server.basePath, a);
	console.info('Mount API path %s', route);
	app.use(mount(route, api[a]));
}


/**
 * Kick start
 */
console.info('Serving the API from port %s', config.server.port);
const server = app.listen(config.server.port);
exports = module.exports = server;


/**
 * @event uncaughtException catcher
 */
app.on('uncaughtException', (err) => {
	// handle the error safely
	console.error('HTTP server/uncaughtException:', err);
	exit(1);
});