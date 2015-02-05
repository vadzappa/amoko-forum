/**
 * Created by zapolski on 04.02.2015.
 */
var _ = require('lodash'),
	keystone = require('keystone'),
	Topic = keystone.list('Topic'),
	Reply = keystone.list('Reply'),
	userUtils = require('../../utils/userUtils');

_.mixin(require('underscore.deferred'));

var internals = {
	findTopicByIdAndUser: function findTopicByIdAndUser(id, user) {
		var deferred = new _.Deferred();
		var q = Topic.model
			.findOne()
			.where('_id', id)
			.populate('author');

		if (!user.isAdmin) {
			q.where('author', user._id);
		}

		q.exec(function (err, topic) {
			deferred.resolve(err || topic);
		});
		return deferred.promise();
	}
};

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	// Load the posts
	view.on('init', function (next) {

		if (!req.params.topicId) {
			return res.redirect('/');
		}

		_.when(internals.findTopicByIdAndUser(req.params.topicId, locals.user)).then(function (topicResult) {
			if (_.isError(topicResult)) {
				req.logger.log(topicResult);
				return res.redirect('/');
			}
			if (!topicResult) {
				req.logger.log(new Error('Topic is empty'));
				return res.redirect('/');
			}

			locals.topic = topicResult;
			locals.data.posts = topicResult.replies;
			return next();
		});

	});

	view.on('post', {action: 'topic.reply'}, function (next) {

		if (!req.params.topicId) {
			return res.redirect('/');
		}
		if (_.isEmpty(req.body.content)) {
			req.flash('error', {
				title: 'Ответ должен содержать текст.'
			});
			return res.redirect(req.path);
		}

		_.when([
			userUtils.findUser(locals.user),
			internals.findTopicByIdAndUser(req.params.topicId, locals.user)
		])
			.then(function (userResult, topicResult) {
				if (_.isError(userResult)) {
					req.logger.log(userResult);
					return res.redirect('/');
				}

				if (!userResult) {
					req.logger.log(new Error('User couldnt be found'));
					return res.redirect(req.path);
				}

				if (_.isError(topicResult)) {
					req.logger.log(topicResult);
					return res.redirect('/');
				}
				if (!topicResult) {
					req.logger.log(new Error('Topic is empty'));
					return res.redirect('/');
				}

				var newReply = new Reply.model({
					author: userResult,
					topic: topicResult,
					content: req.body.content
				});
				newReply.save(function (err) {
					if (err) {
						req.logger.log(err);
					}
					res.redirect(req.path);
				});
			});

	});


	// Render the view
	view.render('answer');

};
