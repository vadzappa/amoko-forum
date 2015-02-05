/**
 * Created by zapolski on 05.02.2015.
 */

var _ = require('lodash'),
	keystone = require('keystone'),
	User = keystone.list('User');

_.mixin(require('underscore.deferred'));

exports = module.exports = {
	findUser: function findUser(user) {
		var deferred = new _.Deferred();
		User.model
			.findOne()
			.where('_id', user._id)
			.exec(function (err, user) {
				deferred.resolve(err || user);
			});		
		return deferred.promise();
	}
};
