<<<<<<< HEAD
require('dotenv').config();
const http = require('http');
const debug = require('debug')('playground:server');
const app = require('../app');
const port = process.env.PORT;

// server setup
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`listening on port: ${port}`));
server.on('listening', () => debug(`listening on port: ${port}`));
server.on('error', error => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	switch (error.code) {
	case 'EACCES':
		console.error(`Port ${port} requires elevated privileges`);
		process.exit(1);
		break;
	case 'EADDRINUSE':
		console.error(`Port ${port} is already in use`);
		process.exit(1);
		break;
	default:
		throw error;
	}
});
=======
require('dotenv').config();
const http = require('http');
const debug = require('debug')('playground:server');
const app = require('../app');
const port = process.env.PORT || 8080;

// server setup
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`listening on port: ${port}`));
server.on('listening', () => debug(`listening on port: ${port}`));
server.on('error', error => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	switch (error.code) {
	case 'EACCES':
		console.error(`Port ${port} requires elevated privileges`);
		process.exit(1);
		break;
	case 'EADDRINUSE':
		console.error(`Port ${port} is already in use`);
		process.exit(1);
		break;
	default:
		throw error;
	}
});
>>>>>>> 1592cf368c2bccf91a5bdac8643287aff01f7e61
