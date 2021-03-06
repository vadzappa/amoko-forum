// Simulate config options from your production environment by
// customising the .env file in your project's root folder.

//fix F*** keystone bug with folders and so on :)
process.chdir(__dirname);

require('dotenv').load();

// Require keystone
var keystone = require('keystone'),
	handlebars = require('express-handlebars'),
	isProduction = !!process.env.NODE_IS_PRODUCTION,
	_ = require('lodash');


// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

	'name': 'Amoko Консультант',
	'brand': 'Amoko Консультант',

	'port': process.env.NODE_PORT || 3000,

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view cache': isProduction,
	'view engine': 'hbs',
	'compress': isProduction,
	'headless': true,
	'logger': isProduction ? 'tiny' : 'dev',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs'
	}).engine,

	'auto update': true,
	'auth': function (req, res, next) {
		res.redirect('/');
	},
	'user model': 'User',
	'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/amoko',
	'cookie secret': 'e{y{T^[A$D}vW1D"+UPpkX%TrOrXb3?8:fWE@SrToL{z-RhT|,L[F-[Iimg(~MgH'

});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'users': 'users'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
