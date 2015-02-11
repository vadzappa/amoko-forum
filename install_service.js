var Service = require('node-windows').Service;

exports = module.exports = function installService(serviceInfo, envArray) {
// Create a new service object
	var svc = new Service({
		name: serviceInfo.name,
		description: serviceInfo.description,
		script: serviceInfo.script,
		env: envArray
	});

// Listen for the "install" event, which indicates the
// process is available as a service.
	svc.on('install', function () {
		svc.start();
	});

	svc.install();

};
