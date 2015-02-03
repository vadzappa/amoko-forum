/**
 * Created by zapolski on 03.02.2015.
 */

var _ = require('lodash'),
	keystone = require('keystone'),
	User = keystone.list('User');


exports.findAndStoreUserByLogin = function findAndStoreUserByLogin(login, next) {
	if ('admin' === login) {
		return next();
	}
	User.model
		.findOne()
		.where('login', login)
		.exec(function (err, user) {
			if (err || user) {
				return next(err || user);
			}
			// create user
			user = new User.model({
				login: login,
				isAdmin: false
			});
			user.save(function (err) {
				next(err || user);
			});
		});
};

exports.findUserByLogin = function findUserByLogin(login, next) {
	User.model
		.findOne()
		.where('login', login)
		.exec(function (err, user) {
			var unableToFindUser = new Error('Unable to find user ' + login + ' using password [YES]');
			next(err || user || unableToFindUser);
		});
};

exports.storeUserToSession = function storeUserToSession(user, req, next) {
	if (user && req.session) {
		req.session.user = user;
		req.session.save(function (err) {

			if (err) {
				req.logger.log(err);
			}

			next();
		});
	} else {
		next();
	}
};
