var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	login: {type: Types.Key, required: true, index: true, initial: true},
	password: {type: Types.Password, initial: true, required: false},
	topics: {type: Types.Relationship, ref: 'Topic', many: true}
}, 'Permissions', {
	isAdmin: {type: Boolean, label: 'Can access Keystone', index: true}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */

User.defaultColumns = 'login, isAdmin';
User.register();
