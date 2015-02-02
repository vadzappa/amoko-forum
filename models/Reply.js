/**
 * Author: Vadim
 * Date: 2/2/2015
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Reply Model
 * ==========
 */

var Reply = new keystone.List('Reply');

Reply.add({
	created: {type: Types.Datetime, default: Date.now, required: true},
	updated: {type: Types.Datetime, default: Date.now, required: true},
	author: {type: Types.Relationship, ref: 'User', required: true, initial: true},
	topic: {type: Types.Relationship, ref: 'Topic', required: true, initial: true},
	content: {type: Types.Textarea, initial: true}
});

/**
 * Registration
 */

Reply.defaultColumns = 'created, updated, author, topic, content';
Reply.register();
