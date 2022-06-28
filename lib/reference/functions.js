'use strict';

const camelCaseFunctions = new Set([
	'translateX',
	'translateY',
	'translateZ',
	'scaleX',
	'scaleY',
	'scaleZ',
	'rotateX',
	'rotateY',
	'rotateZ',
	'skewX',
	'skewY',
]);

const mathFunctions = new Set(['calc', 'clamp', 'max', 'min']);

module.exports = {
	camelCaseFunctions,
	mathFunctions,
};
