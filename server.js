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
	, session = require('koa-generic-session')
	, cookie = require('cookie')
	, koa = require('koa')
	, api = require('./apis')
	, co = require('co')
	, app = koa()
	, userModel = require('./services/user/models/users').Model
	, roomAPI = require('./services/room/api')
	, MongooseStore = require('koa-session-mongoose')
	, sessionStore = new MongooseStore();


mongoose.connect(config.mongo.url);
const db = mongoose.connection;
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

if (config.env !== 'production') {
	app.use(require('koa-cors')({
		credentials: true
	}));
	console.warn('Warning: CORS enabled from all sources!');
}

app.keys = config.server.secrets;


/**
 * @name resolve form or JSON paramter into JS object
 */
app.use(bodyparser());

app.use(session({
	store: sessionStore
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * @name set up websockets and mount under app
 */
const socketIO = require("socket.io");
app.server = require('http').createServer(app.callback());
app.listen = function () {
	app.server.listen.apply(app.server, arguments);
	return app.server;
};

const io = new socketIO(app.server);
let uid;
io.use((socket, next) => {
	const sid = cookie.parse(socket.handshake.headers.cookie)['koa.sid'];
	co(function *() {
		const session = yield sessionStore.get(`koa:sess:${sid}`);
		uid = session.passport.user;
		if (session) {
			next(null, true);	
		} else {
			next(new Error('Hey, I don\'t know who you are, please login first.'));
		}
	 });
});

io.on('connection', (socket) => {
	app.ws = socket;
	socket.on('message', function (msg) {
		// Then our socket established!
		// 
		// ----- one corner case ------
		// The user's session might be expired after establishing an authenticated socket,
		// they can continue sending messages to the server without futher authentication
		// but we can ignore it for now, since the problem only happen when the user keep the 
		// page active and last for 1 day (max-age). Even this happened, the user still valid
		// him/herself before
		// 
		// Therefore, from this point on, just trust the uid from client side and do whatever.
		
		console.log('msg', msg);
		pubEvents(socket, msg);
	});
	socket.on('disconnect', function () {
		console.log('user disconnect');
		toggleStatus('offline', uid);
	});
	toggleStatus('online', uid);
	console.log('[Socket server] connected.');
});

/**
 * @name server error handler
 */
app.use(function *(next) {
	try {
		yield next;
	} catch (err) {
		this.status = err.status || 500;
		this.body = {
			'status': 'error',
			'message': err.message
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
module.exports = app;

/**
 * @event uncaughtException catcher
 */
app.on('uncaughtException', (err) => {
	// handle the error safely
	console.error('HTTP server/uncaughtException:', err);
	exit(1);
});

/**
 * @name update the user online/offline status
 */
function toggleStatus (type, uid) {
	let updates = type === 'online' ? { online: 1 } : { online: 0 };
	userModel.findByIdAndUpdate(uid, { $set: updates }, function (err, data) {
		if (err) {
			console.error(`${uid} ${type} failed! ${err}`);
		} else {
			console.log(`${uid} -> ${type}!`)
		}
	});
}

/**
 * @name handle the sockets events publish
 */
function pubEvents(socket, msg) {
	let opts = {
		auth_user: {
			id: uid
		}
	};
	if (msg.rid) {
		// send to the same socket first
		socket.emit(uid, msg);

		// then get all the others
		let room;
		opts.id = msg.rid;
		co(function *() {
			room = yield roomAPI.find(opts);
			room.users.forEach((user) => {
				socket.broadcast.emit(user._id.toString(), msg);
			});
		});
	}
}