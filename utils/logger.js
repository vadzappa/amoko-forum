/**
 * Created by zapolski on 04.02.2015.
 */

exports = module.exports = logger = {
	log: function () {
		console.log.apply(console.log, arguments);
	}
};
