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

const colorFunctions = new Set([
	'color',
	'color-mix',
	'hsl',
	'hsla',
	'hwb',
	'lab',
	'lch',
	'oklab',
	'oklch',
	'rgb',
	'rgba',
]);

const mathFunctions = new Set(['calc', 'clamp', 'max', 'min']);

module.exports = {
	camelCaseFunctions,
	colorFunctions,
	mathFunctions,
};
