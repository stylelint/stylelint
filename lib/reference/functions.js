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

const mathFunctions = new Set([
	'abs',
	'acos',
	'asin',
	'atan',
	'atan2',
	'calc',
	'clamp',
	'cos',
	'exp',
	'hypot',
	'log',
	'max',
	'min',
	'mod',
	'pow',
	'rem',
	'round',
	'sign',
	'sin',
	'sqrt',
	'tan',
]);

module.exports = {
	camelCaseFunctions,
	colorFunctions,
	mathFunctions,
};
