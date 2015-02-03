/**
 * Created by zapolski on 03.02.2015.
 */
var _ = require('lodash'),
	keystone = require('keystone'),
	Topic = keystone.list('Topic'),
	loginUtils = require('../../utils/loginUtil');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'admin';

	view.on('post', {action: 'admin.login'}, function (next) {
		var login = req.body.login,
			password = req.body.password;

		loginUtils.findUserByLogin(login, function (result) {
			if (_.isError(result)) {
				req.logger.log(result);
				req.flash('error', {
					title: 'Попытка входа не удалась. Попробуйте снова.'
				});
				next();
			} else {
				var user = result;
				user._.password.compare(password, function (err, isMatch) {
					if (!err && isMatch) {
						loginUtils.storeUserToSession(user, req, function () {
							res.redirect('/');
						});

					} else {
						req.logger.log(err);
						next();
					}
				});
			}
		});
	});


	// Render the view
	view.render('admin');

};
