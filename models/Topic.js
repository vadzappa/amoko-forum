/**
 * Author: Vadim
 * Date: 2/2/2015
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Topic Model
 * ==========
 */

var Topic = new keystone.List('Topic');

Topic.add({
	created: {type: Types.Datetime, default: Date.now, required: true},
	updated: {type: Types.Datetime, default: Date.now, required: true},
	author: {type: Types.Relationship, ref: 'User', required: true, initial: true},
	title: {type: String, required: true, initial: true},
	content: {type: Types.Textarea, initial: true}
});

/**
 * Registration
 */

Topic.defaultColumns = 'created, updated, author, title, content';
Topic.register();
