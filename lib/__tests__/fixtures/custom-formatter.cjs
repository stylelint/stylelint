const { inspect } = require('node:util');

module.exports = function customFormatter(results) {
	return inspect(results);
}
