/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore'),
	keystone = require('keystone'),
	User = keystone.list('User');

var findAndStoreUserByLogin = function (login, req, next) {
		if ('admin' === login){
			return next();
		}
		User.model
			.findOne()
			.where('login', login)
			.exec(function (err, user) {
				if (err) {
					return next(err);
				}
				if (user != null) {
					req.user = user;
					return next();
				}
				// create user
				user = new User.model({
					login: login,
					isAdmin: false
				});
				user.save(function (err) {
					// post has been saved
					if (!err) {
						req.user = user;
					}
					next(err);
				});
			});
	},
	storeUserFromQuery = function storeUserFromQuery(req, next) {
		findAndStoreUserByLogin(req.query.user, req, next);
	},
	storeUserFromSession = function storeUserFromSession(req, next) {
		findAndStoreUserByLogin(req.session.user.login, req, next);
	};

exports.loginFromQuery = function loginFromQuery(req, res, next) {
	if (req.query.user) {
		storeUserFromQuery(req, function (err) {
			if (err) {
				req.locals.logger.log(err);
			}
			next()
		});
	} else if (req.session && req.session.user) {
		storeUserFromSession(req, function (err) {
			if (err) {
				req.locals.logger.log(err);
			}
			next()
		});
	} else {
		next();
	}
};

exports.storeLoginToSession = function storeLoginToSession(req, res, next) {
	if (req.user) {
		req.session.user = req.user;
		req.session.save(function (err) {

			if (err) {
				req.locals.logger.log(err);
			}

			next();
		});
	} else {
		next();
	}
};

/**
 Initialises the standard view locals

 The included layout depends on the navLinks array to generate
 the navigation in the header, you may wish to change this array
 or replace it with your own templates / logic.
 */

exports.initLocals = function (req, res, next) {

	var locals = res.locals;

	locals.navLinks = [
		{label: 'Консультация', key: 'home', href: '/'}
	];

	locals.user = req.user;
	locals.data = {};

	next();

};


/**
 Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function (req, res, next) {
	next();
};
