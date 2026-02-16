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
export const hueAsFirstComponentColorFunctions = new Set(['hsl', 'hsla', 'hwb']);

/** @type {ReadonlySet<string>} */
export const hueAsThirdComponentColorFunctions = new Set(['lch', 'oklch']);

/** @type {ReadonlySet<string>} */
export const hueColorFunctions = new Set([
	...hueAsFirstComponentColorFunctions,
	...hueAsThirdComponentColorFunctions,
]);

/** @type {ReadonlySet<string>} */
export const lightnessZeroToOneColorFunctions = new Set(['oklab', 'oklch']);

/** @type {ReadonlySet<string>} */
export const lightnessZeroToHundredColorFunctions = new Set(['lab', 'lch']);

/** @type {ReadonlySet<string>} */
export const lightnessColorFunctions = new Set([
	...lightnessZeroToOneColorFunctions,
	...lightnessZeroToHundredColorFunctions,
]);

/** @type {ReadonlySet<string>} */
export const withAlphaAliasColorFunctions = new Set(['hsla', 'rgba']);

/** @type {ReadonlySet<string>} */
export const withoutAlphaAliasColorFunctions = new Set(['hsl', 'rgb']);

/** @type {ReadonlySet<string>} */
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
