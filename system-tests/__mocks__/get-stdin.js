'use strict';

module.exports = () => {
	return new Promise((resolve) => {
		process.nextTick(() => {
			resolve('');
		});
	});
};
