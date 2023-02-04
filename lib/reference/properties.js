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

/** @type {import('stylelint').OrderedLonghandSubPropertiesOfShorthandProperties} */
const orderedLonghandSubPropertiesOfShorthandProperties = new Map([
	// Sort alphabetically
	[
		'animation',
		[
			// prettier-ignore
			'animation-name',
			'animation-duration',
			'animation-timing-function',
			'animation-delay',
			'animation-iteration-count',
			'animation-direction',
			'animation-fill-mode',
			'animation-play-state',
		],
	],
	[
		'background',
		[
			// prettier-ignore
			'background-image',
			'background-size',
			'background-position',
			'background-repeat',
			'background-origin',
			'background-clip',
			'background-attachment',
			'background-color',
		],
	],
	[
		'border',
		[
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
		],
	],
	[
		'border-block-end',
		[
			// prettier-ignore
			'border-block-end-width',
			'border-block-end-style',
			'border-block-end-color',
		],
	],
	[
		'border-block-start',
		[
			// prettier-ignore
			'border-block-start-width',
			'border-block-start-style',
			'border-block-start-color',
		],
	],
	[
		'border-bottom',
		[
			// prettier-ignore
			'border-bottom-width',
			'border-bottom-style',
			'border-bottom-color',
		],
	],
	[
		'border-color',
		[
			// prettier-ignore
			'border-top-color',
			'border-right-color',
			'border-bottom-color',
			'border-left-color',
		],
	],
	[
		'border-image',
		[
			// prettier-ignore
			'border-image-source',
			'border-image-slice',
			'border-image-width',
			'border-image-outset',
			'border-image-repeat',
		],
	],
	[
		'border-inline-end',
		[
			// prettier-ignore
			'border-inline-end-width',
			'border-inline-end-style',
			'border-inline-end-color',
		],
	],
	[
		'border-inline-start',
		[
			// prettier-ignore
			'border-inline-start-width',
			'border-inline-start-style',
			'border-inline-start-color',
		],
	],
	[
		'border-left',
		[
			// prettier-ignore
			'border-left-width',
			'border-left-style',
			'border-left-color',
		],
	],
	[
		'border-radius',
		[
			// prettier-ignore
			'border-top-right-radius',
			'border-top-left-radius',
			'border-bottom-right-radius',
			'border-bottom-left-radius',
		],
	],
	[
		'border-right',
		[
			// prettier-ignore
			'border-right-width',
			'border-right-style',
			'border-right-color',
		],
	],
	[
		'border-style',
		[
			// prettier-ignore
			'border-top-style',
			'border-right-style',
			'border-bottom-style',
			'border-left-style',
		],
	],
	[
		'border-top',
		[
			// prettier-ignore
			'border-top-width',
			'border-top-style',
			'border-top-color',
		],
	],
	[
		'border-width',
		[
			// prettier-ignore
			'border-top-width',
			'border-bottom-width',
			'border-left-width',
			'border-right-width',
		],
	],
	[
		'column-rule',
		[
			// prettier-ignore
			'column-rule-width',
			'column-rule-style',
			'column-rule-color',
		],
	],
	[
		'columns',
		[
			// prettier-ignore
			'column-width',
			'column-count',
		],
	],
	[
		'flex',
		[
			// prettier-ignore
			'flex-grow',
			'flex-shrink',
			'flex-basis',
		],
	],
	[
		'flex-flow',
		[
			// prettier-ignore
			'flex-direction',
			'flex-wrap',
		],
	],
	[
		'font',
		[
			// prettier-ignore
			'font-style',
			'font-variant',
			'font-weight',
			'font-stretch',
			'font-size',
			'line-height',
			'font-family',
		],
	],
	[
		'grid',
		[
			// prettier-ignore
			'grid-template-rows',
			'grid-template-columns',
			'grid-template-areas',
			'grid-auto-rows',
			'grid-auto-columns',
			'grid-auto-flow',
			'grid-column-gap',
			'grid-row-gap',
		],
	],
	[
		'grid-area',
		[
			// prettier-ignore
			'grid-row-start',
			'grid-column-start',
			'grid-row-end',
			'grid-column-end',
		],
	],
	[
		'grid-column',
		[
			// prettier-ignore
			'grid-column-start',
			'grid-column-end',
		],
	],
	[
		'grid-gap',
		[
			// prettier-ignore
			'grid-row-gap',
			'grid-column-gap',
		],
	],
	[
		'grid-row',
		[
			// prettier-ignore
			'grid-row-start',
			'grid-row-end',
		],
	],
	[
		'grid-template',
		[
			// prettier-ignore
			'grid-template-columns',
			'grid-template-rows',
			'grid-template-areas',
		],
	],
	[
		'list-style',
		[
			// prettier-ignore
			'list-style-type',
			'list-style-position',
			'list-style-image',
		],
	],
	[
		'margin',
		[
			// prettier-ignore
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left',
		],
	],
	[
		'mask',
		[
			// prettier-ignore
			'mask-image',
			'mask-mode',
			'mask-position',
			'mask-size',
			'mask-repeat',
			'mask-origin',
			'mask-clip',
			'mask-composite',
		],
	],
	[
		'outline',
		[
			// prettier-ignore
			'outline-color',
			'outline-style',
			'outline-width',
		],
	],
	[
		'padding',
		[
			// prettier-ignore
			'padding-top',
			'padding-right',
			'padding-bottom',
			'padding-left',
		],
	],
	[
		'text-decoration',
		[
			// prettier-ignore
			'text-decoration-line',
			'text-decoration-style',
			'text-decoration-color',
		],
	],
	[
		'text-emphasis',
		[
			// prettier-ignore
			'text-emphasis-style',
			'text-emphasis-color',
		],
	],
	[
		'transition',
		[
			// prettier-ignore
			'transition-property',
			'transition-duration',
			'transition-timing-function',
			'transition-delay',
		],
	],
]);

function convertToLonghandSubPropertiesOfShorthandProperties() {
	const map = new Map();

	for (const [shorthand, orderedLonghand] of orderedLonghandSubPropertiesOfShorthandProperties) {
		map.set(shorthand, new Set(orderedLonghand));
	}

	return map;
}

/** @type {import('stylelint').LonghandSubPropertiesOfShorthandProperties} */
const longhandSubPropertiesOfShorthandProperties =
	convertToLonghandSubPropertiesOfShorthandProperties();

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
	orderedLonghandSubPropertiesOfShorthandProperties,
	shorthandTimeProperties,
};
