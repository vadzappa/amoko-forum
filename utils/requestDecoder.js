/**
 * Author: Vadim
 * Date: 2/5/2015
 */

var crypto = require('crypto'),
	password = process.env.NODE_PASSWORD || 'zgt9HHHDXfRMC5goa4nI0w==';

var decodeMessage = function decodeMessage(password, message) {
	return message;
};

exports = module.exports = {
	decryptString: function decryptString(encrypted) {
		return decodeMessage(password, encrypted);
	}
};
