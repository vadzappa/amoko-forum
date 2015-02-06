/**
 * Author: Vadim
 * Date: 2/5/2015
 */

var sjcl = require('sjcl'),
	base64 = require('./base64'),
	password = process.env.NODE_PASSWORD || 'wfF9cjDrZ4s43dtT8GMWn9Y3y3483Z8Z';

exports = module.exports = {
	decryptString: function decryptString(encrypted) {
		try {
			return sjcl.decrypt(password, base64.decode(encrypted));
		} catch (e) {
			return null;
		}
	}
};
