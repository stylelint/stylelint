/** @type {ReadonlySet<string>} */
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

/** @type {ReadonlySet<string>} */
export const colorFunctions = new Set([
	'color',
	'color-contrast', // Safari TP122
	'color-mix',
	'contrast-color',
	'device-cmyk',
	'hsl',
	'hsla',
	'hwb',
	'lab',
	'lch',
	'light-dark',
	'oklab',
	'oklch',
	'rgb',
	'rgba',
]);

/** @type {ReadonlySet<string>} */
const singleArgumentMathFunctions = new Set([
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

/** @type {ReadonlySet<string>} */
export const mathFunctions = new Set([
	...singleArgumentMathFunctions,
	'atan2',
	'calc-size',
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
