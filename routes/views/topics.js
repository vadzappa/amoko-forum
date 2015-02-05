/**
 * Author: Vadim
 * Date: 2/2/2015
 */
var _ = require('lodash'),
	keystone = require('keystone'),
	Topic = keystone.list('Topic'),
	userUtils = require('../../utils/userUtils'),
	mdUtils = require('../../utils/mdUtil');

_.mixin(require('underscore.deferred'));

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	// Load the posts
	view.on('get', function (next) {

		if (!locals.user) {
			req.flash('warning', {
				title: 'Пожалуйста, войдите в систему.',
				detail: 'Для входа используйте Amoko приложение (кнопка консультант)'
			});
			return next();
		}

		var q = Topic.paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10
		})
			.sort('-updated')
			.populate('author');

		if (!locals.user.isAdmin) {
			q.where('author', locals.user._id);
		}

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});

	});

	view.on('post', {action: 'topic.create'}, function (next) {

		if (!req.body.title || !req.body.content) {
			req.flash('error', {
				title: 'Пожалуйста, введите Тему и Содержание.'
			});
			return res.redirect(req.path);
		}

		_.when(userUtils.findUser(locals.user)).then(function (result) {
			if (_.isError(result)) {
				req.logger.log(result);
				return res.redirect('/');
			}
			if (!result) {
				return res.redirect('/');
			}

			var newTopic = new Topic.model({
				author: result,
				title: req.body.title
			});
			newTopic.content.html = mdUtils.fromMarkdown(req.body.content);
			newTopic.save(function (err) {
				if (err) {
					req.logger.log(err);
				}
				res.redirect('/');
			});
		});
	});


	// Render the view
	view.render('topics');

};
