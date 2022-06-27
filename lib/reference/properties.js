'use strict';

const acceptCustomIdentsProperties = new Set([
	'animation',
	'animation-name',
	'font',
	'font-family',
	'counter-increment',
	'grid-row',
	'grid-column',
	'grid-area',
	'list-style',
	'list-style-type',
]);

/** @type {import('stylelint').LonghandSubPropertiesOfShorthandProperties} */
const longhandSubPropertiesOfShorthandProperties = new Map([
	// Sort alphabetically
	[
		'animation',
		new Set([
			'animation-name',
			'animation-duration',
			'animation-timing-function',
			'animation-delay',
			'animation-iteration-count',
			'animation-direction',
			'animation-fill-mode',
			'animation-play-state',
		]),
	],
	[
		'background',
		new Set([
			'background-image',
			'background-size',
			'background-position',
			'background-repeat',
			'background-origin',
			'background-clip',
			'background-attachment',
			'background-color',
		]),
	],
	[
		'border',
		new Set([
			'border-top-width',
			'border-bottom-width',
			'border-left-width',
			'border-right-width',
			'border-top-style',
			'border-bottom-style',
			'border-left-style',
			'border-right-style',
			'border-top-color',
			'border-bottom-color',
			'border-left-color',
			'border-right-color',
		]),
	],
	[
		'border-block-end',
		new Set([
			// prettier-ignore
			'border-block-end-width',
			'border-block-end-style',
			'border-block-end-color',
		]),
	],
	[
		'border-block-start',
		new Set([
			// prettier-ignore
			'border-block-start-width',
			'border-block-start-style',
			'border-block-start-color',
		]),
	],
	[
		'border-bottom',
		new Set([
			// prettier-ignore
			'border-bottom-width',
			'border-bottom-style',
			'border-bottom-color',
		]),
	],
	[
		'border-color',
		new Set([
			// prettier-ignore
			'border-top-color',
			'border-bottom-color',
			'border-left-color',
			'border-right-color',
		]),
	],
	[
		'border-image',
		new Set([
			'border-image-source',
			'border-image-slice',
			'border-image-width',
			'border-image-outset',
			'border-image-repeat',
		]),
	],
	[
		'border-inline-end',
		new Set([
			// prettier-ignore
			'border-inline-end-width',
			'border-inline-end-style',
			'border-inline-end-color',
		]),
	],
	[
		'border-inline-start',
		new Set([
			'border-inline-start-width',
			'border-inline-start-style',
			'border-inline-start-color',
		]),
	],
	[
		'border-left',
		new Set([
			// prettier-ignore
			'border-left-width',
			'border-left-style',
			'border-left-color',
		]),
	],
	[
		'border-radius',
		new Set([
			'border-top-right-radius',
			'border-top-left-radius',
			'border-bottom-right-radius',
			'border-bottom-left-radius',
		]),
	],
	[
		'border-right',
		new Set([
			// prettier-ignore
			'border-right-width',
			'border-right-style',
			'border-right-color',
		]),
	],
	[
		'border-style',
		new Set([
			// prettier-ignore
			'border-top-style',
			'border-bottom-style',
			'border-left-style',
			'border-right-style',
		]),
	],
	[
		'border-top',
		new Set([
			// prettier-ignore
			'border-top-width',
			'border-top-style',
			'border-top-color',
		]),
	],
	[
		'border-width',
		new Set([
			// prettier-ignore
			'border-top-width',
			'border-bottom-width',
			'border-left-width',
			'border-right-width',
		]),
	],
	[
		'column-rule',
		new Set([
			// prettier-ignore
			'column-rule-width',
			'column-rule-style',
			'column-rule-color',
		]),
	],
	[
		'columns',
		new Set([
			// prettier-ignore
			'column-width',
			'column-count',
		]),
	],
	[
		'flex',
		new Set([
			// prettier-ignore
			'flex-grow',
			'flex-shrink',
			'flex-basis',
		]),
	],
	[
		'flex-flow',
		new Set([
			// prettier-ignore
			'flex-direction',
			'flex-wrap',
		]),
	],
	[
		'font',
		new Set([
			'font-style',
			'font-variant',
			'font-weight',
			'font-stretch',
			'font-size',
			'font-family',
			'line-height',
		]),
	],
	[
		'grid',
		new Set([
			'grid-template-rows',
			'grid-template-columns',
			'grid-template-areas',
			'grid-auto-rows',
			'grid-auto-columns',
			'grid-auto-flow',
			'grid-column-gap',
			'grid-row-gap',
		]),
	],
	[
		'grid-area',
		new Set([
			// prettier-ignore
			'grid-row-start',
			'grid-column-start',
			'grid-row-end',
			'grid-column-end',
		]),
	],
	[
		'grid-column',
		new Set([
			// prettier-ignore
			'grid-column-start',
			'grid-column-end',
		]),
	],
	[
		'grid-gap',
		new Set([
			// prettier-ignore
			'grid-row-gap',
			'grid-column-gap',
		]),
	],
	[
		'grid-row',
		new Set([
			// prettier-ignore
			'grid-row-start',
			'grid-row-end',
		]),
	],
	[
		'grid-template',
		new Set([
			// prettier-ignore
			'grid-template-columns',
			'grid-template-rows',
			'grid-template-areas',
		]),
	],
	[
		'list-style',
		new Set([
			// prettier-ignore
			'list-style-type',
			'list-style-position',
			'list-style-image',
		]),
	],
	[
		'margin',
		new Set([
			// prettier-ignore
			'margin-top',
			'margin-bottom',
			'margin-left',
			'margin-right',
		]),
	],
	[
		'mask',
		new Set([
			'mask-image',
			'mask-mode',
			'mask-position',
			'mask-size',
			'mask-repeat',
			'mask-origin',
			'mask-clip',
			'mask-composite',
		]),
	],
	[
		'outline',
		new Set([
			// prettier-ignore
			'outline-color',
			'outline-style',
			'outline-width',
		]),
	],
	[
		'padding',
		new Set([
			// prettier-ignore
			'padding-top',
			'padding-bottom',
			'padding-left',
			'padding-right',
		]),
	],
	[
		'text-decoration',
		new Set([
			// prettier-ignore
			'text-decoration-color',
			'text-decoration-style',
			'text-decoration-line',
		]),
	],
	[
		'text-emphasis',
		new Set([
			// prettier-ignore
			'text-emphasis-style',
			'text-emphasis-color',
		]),
	],
	[
		'transition',
		new Set([
			'transition-delay',
			'transition-duration',
			'transition-property',
			'transition-timing-function',
		]),
	],
]);

const longhandTimeProperties = new Set([
	'transition-duration',
	'transition-delay',
	'animation-duration',
	'animation-delay',
]);

const shorthandTimeProperties = new Set(['transition', 'animation']);

module.exports = {
	acceptCustomIdentsProperties,
	longhandSubPropertiesOfShorthandProperties,
	longhandTimeProperties,
	shorthandTimeProperties,
};
