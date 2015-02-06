var serviceInfo = require('./service_info'),
	enviroment = require('./env.js'),
	Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
	name: serviceInfo.name,
	description: serviceInfo.description,
	script: serviceInfo.script,
	env: enviroment
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
	svc.start();
});

svc.install();
