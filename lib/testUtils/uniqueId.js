'use strict';

let latestId = 0;

/**
 * @returns {number}
 */
module.exports = function uniqueId() {
	return ++latestId;
};
