'use strict';

const _ = require('lodash');

module.exports = function(...args) {
	const mergeWithArgs = [{}];

	Array.from(args).forEach((arg) => mergeWithArgs.push(arg));
	mergeWithArgs.push(mergeCustomizer);

	return _.mergeWith(...mergeWithArgs);
};

function mergeCustomizer(objValue, srcValue) {
	if (Array.isArray(objValue, mergeCustomizer)) {
		return objValue.concat(srcValue);
	}
}
