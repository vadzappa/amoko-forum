/**
 * Author: Vadim
 * Date: 2/2/2015
 */
var keystone = require('keystone'),
	Topic = keystone.list('Topic');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	// Load the posts
	view.on('init', function (next) {

		if (!locals.user) {
			return next();
		}

		var q = Topic.paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10
		})
			.where('author', locals.user.id)
			.sort('-updated')
			.populate('author replies');

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});

	});

	view.on('post', {action: 'topic.create'}, function (next) {
		var newTopic = new Topic.model({
			author: locals.user,
			title: req.body.title,
			content: req.body.content
		});

		newTopic.save(function (err) {
			if (err) {
				req.locals.logger.log(err);
			}
			res.redirect('/');
		});
	});


	// Render the view
	view.render('topics');

};
