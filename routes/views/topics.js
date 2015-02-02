/**
 * Author: Vadim
 * Date: 2/2/2015
 */
var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'topics';

	
	
	// Render the view
	view.render('topics');

};
