/**
 * Author: Vadim
 * Date: 2/5/2015
 */

var _ = require('lodash'),
	marked = require('marked');

marked.setOptions({
	gfm: true,
	tables: true,
	sanitize: true,
	smartypants: true
});


exports = module.exports = {
	fromMarkdown: function fromMarkdown(code) {
		return marked(code);
	}
};
