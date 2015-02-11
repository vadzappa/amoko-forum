var argv = require('argv'),
	fs = require('fs'),
	path = require('path'),
	installer = require('./install_service'),
	uninstaller = require('./uninstall_service'),
	appArguments = argv.info('Service installing for forums; Examples:' +
	'\nnode service_cli.js -e env.json -info service.json -a install' +
	'\nnode service_cli.js -info service.json -a uninstall').option([
		{
			name: 'env',
			short: 'e',
			type: 'path',
			description: 'Defines file with environment variables (JSON)'
		},
		{
			name: 'info',
			short: 'i',
			type: 'path',
			description: 'Defines file with service info (name, executable, etc) (JSON)'
		},
		{
			name: 'action',
			short: 'a',
			type: 'string',
			description: 'Action -> install or uninstall'
		},
		{
			name: 'script',
			short: 's',
			type: 'path',
			description: 'Defines file with executable (JS)'
		}
	]).run();

var action = appArguments.options.action,
	serviceInfo = appArguments.options.info,
	serviceInfoParsed = serviceInfo ? JSON.parse(fs.readFileSync(serviceInfo), 'utf8') : undefined,
	serviceEnv = appArguments.options.env,
	serviceEnvParsed = serviceEnv ? JSON.parse(fs.readFileSync(serviceEnv), 'utf8') : undefined,
	executable = appArguments.options.script || path.resolve('keystone.js');
if (!action || !serviceInfo) {
	return argv.help();
}

serviceInfoParsed.script = executable;

switch (action) {
	case 'install':
		if (!serviceEnv) {
			return argv.help();
		}
		installer(serviceInfoParsed, serviceEnvParsed);
		return;
	case 'uninstall':
		uninstaller(serviceInfoParsed);
		return;
}
