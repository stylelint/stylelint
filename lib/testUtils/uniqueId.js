'use strict';

let latestId = 0;

module.exports = function uniqueId() {
	return ++latestId;
};
