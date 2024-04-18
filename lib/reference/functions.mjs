export const camelCaseFunctions = new Set([
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

export const colorFunctions = new Set([
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

export const singleArgumentMathFunctions = new Set([
	'abs',
	'acos',
	'asin',
	'atan',
	'calc',
	'cos',
	'exp',
	'sign',
	'sin',
	'sqrt',
	'tan',
]);

export const mathFunctions = new Set([
	...singleArgumentMathFunctions,
	'atan2',
	'clamp',
	'hypot',
	'log',
	'max',
	'min',
	'mod',
	'pow',
	'rem',
	'round',
]);
