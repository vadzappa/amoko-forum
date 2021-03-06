/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname),
	logger = require('../utils/logger'),
	session = require('express-session'),
	sessionMiddleware = session({
		secret: process.env.NODE_COOKIE_SECRET || 'cookies_secret',
		resave: false,
		saveUninitialized: true,
		cookie: {path: '/', httpOnly: true, secure: false, maxAge: 60 * 60 * 1000}
	}),
	loggerMiddleware = function (req, res, next) {
		req.logger = req.logger || logger;
		next();
	};

keystone.pre('routes', sessionMiddleware);
keystone.pre('routes', loggerMiddleware);

keystone.pre('routes', middleware.loginFromQuery);

// Common Middleware
keystone.pre('routes', middleware.initLocals);

keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function (req, res, next) {
	res.notfound();
});

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function (app) {

	// Views
	app.all('/', routes.views.topics);
	app.all('/admin', routes.views.admin);

	app.post('/', middleware.requireLogin, routes.views.topics);
	app.all('/answer/:topicId', middleware.requireLogin, routes.views.answer);


	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
