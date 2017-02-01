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
	, koa = require('koa')
	, api = require('./apis')
	, app = koa();


/**
 * @name response time counter
 */
app.use(function *(next){
	let start = new Date;
	yield next;
	let ms = new Date - start;
	this.set('X-Response-Time', ms + 'ms');
});


/**
 * @name server error handler
 */
app.use(function *(next) {
	try {
		yield next;
	} catch (err) {
		this.status = err.status || 500;
		this.set('Content-Type', 'text/plain');
		switch (this.status) {
			case 400:
				this.body = "Bad Request";
				if (err.message) this.body += `: ${err.message}`;
				break;
			case 401:
				this.body = "Unauthorized";
				if (err.message) this.body += `: ${err.message}`;
				break;
			case 404:
				this.body = "Not Found";
				if (err.message) this.body += `: ${err.message}`;
				break;
			case 405:
				this.body = "Method Not Allowed";
				if (err.message) this.body += `: ${err.message}`;
				break;
			default:
				console.error("error stack: ", err);
				this.body = "Gosh! Something went wrong...";
				break;
	}
	console.warn(`[HTTP REST server] app error: ${this.status} ${this.request.method} ${this.request.url} ${this.body}`);
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

/**
 * @event catch ctrl-c
 */
process.on('SIGINT', () => {
	console.warn("HTTP server/Received SIGINT");
	serverShutdown();
});

/**
 * @event catch shutdown message
 */
process.on('message', (msg) => {
	if (msg == 'shutdown') {
		console.warn("HTTP server/Received 'shutdown' message");
		serverShutdown();
	}
});

/**
 * @event catch sigterm
 */
process.on('SIGTERM', () => {
	console.warn("HTTP server/Received SIGTERM");
	serverShutdown();
});

/**
 * @event catch server close message
 */
server.on('close', () => {
	console.info("HTTP server closed");
	/**
	
		TODO:
		- close DB connections
		- shutdown all services
	
	 */
	
	// need to be handled after shutdown complete
	if (closingTimeout !== undefined) {
      clearTimeout(closingTimeout);
    }
	
	process.exit();
});

/**
 * @event catch process exit event
 */
process.on('exit', () => {
	console.warn("--------------------------- HTTP API server EXIT ------------------------");
});


// handle server shutdown
let closingDown = false;
let closingTimeout;

function serverShutdown() {
	if (!closingDown && !!server) {
		closingDown = true;
		closingTimeout = setTimeout(function() {
			console.warn('HTTP server/Graceful shutdown failed -- forcing exit');
			process.exit(1);
		}, 15000);
		console.warn("HTTP server/API server shutdown sequence...");
		server.close();
	}
}
