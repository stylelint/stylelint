const fs = require('fs');
const path = require('path');

/**
 * @param {string} formatterPath
 * @returns {string}
 */
module.exports = function resolveCustomFormatter(formatterPath) {
	const resolvedPath = path.resolve(formatterPath);

	if (fs.existsSync(resolvedPath)) {
		return resolvedPath;
	}

	return require.resolve(formatterPath);
};
