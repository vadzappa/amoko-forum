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
	loginUtils = require('../utils/loginUtil'),
	requestDecoder = require('../utils/requestDecoder');

var internals = {
	findAndStoreUserByLogin: function findAndStoreUserByLogin(login, req, next) {
		loginUtils.findAndStoreUserByLogin(login, function (result) {
			if (_.isError(result)) {
				return next(result);
			}
			loginUtils.storeUserToSession(result, req, next);
		});
	},
	storeUserFromQuery: function storeUserFromQuery(req, next) {
		internals.findAndStoreUserByLogin(requestDecoder.decryptString(req.query.user), req, next);
	}
};

module.exports = {
	loginFromQuery: function loginFromQuery(req, res, next) {
		if (req.query.user) {
			internals.storeUserFromQuery(req, function (err) {
				if (err) {
					req.logger.log(err);
				}
				next();
			});
		} else {
			next();
		}
	},
	initLocals: function initLocals(req, res, next) {

		var locals = res.locals;

		locals.navLinks = [
			{label: 'Консультация', key: 'home', href: '/'}
		];

		locals.data = {};
		
		req.session.reload(function(err) {
			// session updated
			if (err) {
				req.logger.log(err);
			} else {
				locals.user = req.session && req.session.user;
			}
			next();
		});

	},
	flashMessages: function flashMessages(req, res, next) {

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

	},
	requireLogin: function requireLogin(req, res, next){
		if (req.session && req.session.user){
			next();
		} else {
			res.redirect('/');
		}
	}
};
