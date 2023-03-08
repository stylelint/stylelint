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
			// prettier-ignore
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
			// prettier-ignore
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
			// prettier-ignore
			'border-top-width',
			'border-right-width',
			'border-bottom-width',
			'border-left-width',
			'border-top-style',
			'border-right-style',
			'border-bottom-style',
			'border-left-style',
			'border-top-color',
			'border-right-color',
			'border-bottom-color',
			'border-left-color',
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
			'border-right-color',
			'border-bottom-color',
			'border-left-color',
		]),
	],
	[
		'border-image',
		new Set([
			// prettier-ignore
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
			// prettier-ignore
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
			// prettier-ignore
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
			'border-right-style',
			'border-bottom-style',
			'border-left-style',
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
			// prettier-ignore
			'font-style',
			'font-variant',
			'font-weight',
			'font-stretch',
			'font-size',
			'line-height',
			'font-family',
		]),
	],
	[
		'grid',
		new Set([
			// prettier-ignore
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
		'inset',
		new Set([
			// prettier-ignore
			'top',
			'right',
			'bottom',
			'left',
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
			'margin-right',
			'margin-bottom',
			'margin-left',
		]),
	],
	[
		'mask',
		new Set([
			// prettier-ignore
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
			'padding-right',
			'padding-bottom',
			'padding-left',
		]),
	],
	[
		'text-decoration',
		new Set([
			// prettier-ignore
			'text-decoration-line',
			'text-decoration-style',
			'text-decoration-color',
			// TODO: add support for text-decoration-thickness, Level 4
			// https://w3c.github.io/csswg-drafts/css-text-decor-4/#text-decoration-width-property
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
			// prettier-ignore
			'transition-property',
			'transition-duration',
			'transition-timing-function',
			'transition-delay',
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
