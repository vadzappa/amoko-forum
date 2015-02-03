/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('lodash'),
	keystone = require('keystone'),
	User = keystone.list('User'),
	loginUtils = require('../utils/loginUtil');

var findAndStoreUserByLogin = function (login, req, next) {
		loginUtils.findAndStoreUserByLogin(login, function (result) {
			if (_.isError(result)) {
				return next(result);
			}
			if (result != null) {
				req.user = result;
			}
			next();
		});
	},
	storeUserFromQuery = function storeUserFromQuery(req, next) {
		findAndStoreUserByLogin(req.query.user, req, next);
	},
	storeUserFromSession = function storeUserFromSession(req, next) {
		loginUtils.findUserByLogin(req.session.user.login, function (result) {
			if (_.isError(result)) {
				return next(result);
			}
			if (result != null) {
				req.user = result;
			}
			next();
		});
	};

exports.loginFromQuery = function loginFromQuery(req, res, next) {
	if (req.query.user) {
		storeUserFromQuery(req, function (err) {
			if (err) {
				req.logger.log(err);
			}
			next();
		});
	} else if (req.session && req.session.user) {
		storeUserFromSession(req, function (err) {
			if (err) {
				req.logger.log(err);
			}
			next();
		});
	} else {
		next();
	}
};

exports.storeLoginToSession = function storeLoginToSession(req, res, next) {
	loginUtils.storeUserToSession(req.user, req, next);
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

exports.flashMessages = function (req, res, next) {

	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};

	res.locals.messages = _.any(flashMessages, function (msgs) {
		return msgs.length;
	}) ? flashMessages : false;

	next();

};
