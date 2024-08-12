export const acceptCustomIdentsProperties = new Set([
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

export const shorthandToResetToInitialProperty = new Map([
	[
		'border',
		new Map([
			['border-image', true],
			['border-image-outset', true],
			['border-image-repeat', true],
			['border-image-slice', true],
			['border-image-source', true],
			['border-image-width', true],
		]),
	],
	[
		/** @see https://www.w3.org/TR/css-fonts-4/#font-prop */
		'font',
		new Map([
			// prettier-ignore
			['font-feature-settings', true],
			['font-kerning', true],
			['font-language-override', true],
			['font-optical-sizing', true],
			['font-size-adjust', true],
			['font-variant-alternates', true],
			['font-variant-caps', true],
			['font-variant-east-asian', true],
			['font-variant-emoji', true],
			['font-variant-ligatures', true],
			['font-variant-numeric', true],
			['font-variant-position', true],
			['font-variation-settings', true],
		]),
	],
]);

/** @type {import('stylelint').LonghandSubPropertiesOfShorthandProperties} */
export const longhandSubPropertiesOfShorthandProperties = new Map([
	// Sort alphabetically
	[
		'animation',
		new Map([
			// prettier-ignore
			['animation-name', true],
			['animation-duration', true],
			['animation-timing-function', true],
			['animation-delay', true],
			['animation-iteration-count', true],
			['animation-direction', true],
			['animation-fill-mode', true],
			['animation-play-state', true],
		]),
	],
	[
		'background',
		new Map([
			// prettier-ignore
			['background-image', true],
			['background-size', true],
			['background-position', true],
			['background-repeat', true],
			['background-origin', true],
			['background-clip', true],
			['background-attachment', true],
			['background-color', true],
		]),
	],
	[
		'border',
		new Map([
			// prettier-ignore
			['border-top-width', true],
			['border-right-width', true],
			['border-bottom-width', true],
			['border-left-width', true],
			['border-top-style', true],
			['border-right-style', true],
			['border-bottom-style', true],
			['border-left-style', true],
			['border-top-color', true],
			['border-right-color', true],
			['border-bottom-color', true],
			['border-left-color', true],
			['border-width', true],
			['border-style', true],
			['border-color', true],
		]),
	],
	[
		'border-block',
		new Map([
			// prettier-ignore
			['border-block-width', true],
			['border-block-style', true],
			['border-block-color', true],
		]),
	],
	[
		'border-block-end',
		new Map([
			// prettier-ignore
			['border-block-end-width', true],
			['border-block-end-style', true],
			['border-block-end-color', true],
		]),
	],
	[
		'border-block-start',
		new Map([
			// prettier-ignore
			['border-block-start-width', true],
			['border-block-start-style', true],
			['border-block-start-color', true],
		]),
	],
	[
		'border-bottom',
		new Map([
			// prettier-ignore
			['border-bottom-width', true],
			['border-bottom-style', true],
			['border-bottom-color', true],
		]),
	],
	[
		'border-color',
		new Map([
			// prettier-ignore
			['border-top-color', true],
			['border-right-color', true],
			['border-bottom-color', true],
			['border-left-color', true],
		]),
	],
	[
		'border-image',
		new Map([
			// prettier-ignore
			['border-image-source', true],
			['border-image-slice', true],
			['border-image-width', true],
			['border-image-outset', true],
			['border-image-repeat', true],
		]),
	],
	[
		'border-inline',
		new Map([
			// prettier-ignore
			['border-inline-width', true],
			['border-inline-style', true],
			['border-inline-color', true],
		]),
	],
	[
		'border-inline-end',
		new Map([
			// prettier-ignore
			['border-inline-end-width', true],
			['border-inline-end-style', true],
			['border-inline-end-color', true],
		]),
	],
	[
		'border-inline-start',
		new Map([
			// prettier-ignore
			['border-inline-start-width', true],
			['border-inline-start-style', true],
			['border-inline-start-color', true],
		]),
	],
	[
		'border-left',
		new Map([
			// prettier-ignore
			['border-left-width', true],
			['border-left-style', true],
			['border-left-color', true],
		]),
	],
	[
		'border-radius',
		new Map([
			// prettier-ignore
			['border-top-left-radius', true],
			['border-top-right-radius', true],
			['border-bottom-right-radius', true],
			['border-bottom-left-radius', true],
		]),
	],
	[
		'border-right',
		new Map([
			// prettier-ignore
			['border-right-width', true],
			['border-right-style', true],
			['border-right-color', true],
		]),
	],
	[
		'border-style',
		new Map([
			// prettier-ignore
			['border-top-style', true],
			['border-right-style', true],
			['border-bottom-style', true],
			['border-left-style', true],
		]),
	],
	[
		'border-top',
		new Map([
			// prettier-ignore
			['border-top-width', true],
			['border-top-style', true],
			['border-top-color', true],
		]),
	],
	[
		'border-width',
		new Map([
			// prettier-ignore
			['border-top-width', true],
			['border-right-width', true],
			['border-bottom-width', true],
			['border-left-width', true],
		]),
	],
	[
		'column-rule',
		new Map([
			// prettier-ignore
			['column-rule-width', true],
			['column-rule-style', true],
			['column-rule-color', true],
		]),
	],
	[
		'columns',
		new Map([
			// prettier-ignore
			['column-width', true],
			['column-count', true],
		]),
	],
	[
		'flex',
		new Map([
			// prettier-ignore
			['flex-grow', true],
			['flex-shrink', true],
			['flex-basis', true],
		]),
	],
	[
		'flex-flow',
		new Map([
			// prettier-ignore
			['flex-direction', true],
			['flex-wrap', true],
		]),
	],
	[
		'font',
		new Map([
			// prettier-ignore
			['font-style', true],
			/**
			 * reset explicitly: normal | small-caps
			 * reset implicitly: all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps
			 * i.e. either way it will be reset
			 * {@link https://www.w3.org/TR/css-fonts-4/#font-variant-prop World Wide Web Consortium}
			 */
			['font-variant', true],
			['font-weight', true],
			['font-stretch', true],
			['font-size', true],
			['line-height', true],
			['font-family', true],
		]),
	],
	[
		'font-synthesis',
		new Map([
			// prettier-ignore
			['font-synthesis-weight', true],
			['font-synthesis-style', true],
			['font-synthesis-small-caps', true],
		]),
	],
	[
		'font-variant',
		new Map([
			// prettier-ignore
			['font-variant-ligatures', true],
			['font-variant-position', true],
			['font-variant-caps', true],
			['font-variant-numeric', true],
			['font-variant-alternates', true],
			['font-variant-east-asian', true],
			['font-variant-emoji', true],
		]),
	],
	[
		'gap',
		new Map([
			// prettier-ignore
			['row-gap', true],
			['column-gap', true],
		]),
	],
	[
		'grid',
		new Map([
			// prettier-ignore
			['grid-template-rows', true],
			['grid-template-columns', true],
			['grid-template-areas', true],
			['grid-auto-rows', true],
			['grid-auto-columns', true],
			['grid-auto-flow', true],
			['grid-column-gap', true],
			['grid-row-gap', true],
		]),
	],
	[
		'grid-area',
		new Map([
			// prettier-ignore
			['grid-row-start', true],
			['grid-column-start', true],
			['grid-row-end', true],
			['grid-column-end', true],
		]),
	],
	[
		'grid-column',
		new Map([
			// prettier-ignore
			['grid-column-start', true],
			['grid-column-end', true],
		]),
	],
	[
		'grid-gap',
		new Map([
			// prettier-ignore
			['grid-row-gap', true],
			['grid-column-gap', true],
		]),
	],
	[
		'grid-row',
		new Map([
			// prettier-ignore
			['grid-row-start', true],
			['grid-row-end', true],
		]),
	],
	[
		'grid-template',
		new Map([
			// prettier-ignore
			['grid-template-columns', true],
			['grid-template-rows', true],
			['grid-template-areas', true],
		]),
	],
	[
		'inset',
		new Map([
			// prettier-ignore
			['top', true],
			['right', true],
			['bottom', true],
			['left', true],
		]),
	],
	[
		'inset-block',
		new Map([
			// prettier-ignore
			['inset-block-start', true],
			['inset-block-end', true],
		]),
	],
	[
		'inset-inline',
		new Map([
			// prettier-ignore
			['inset-inline-start', true],
			['inset-inline-end', true],
		]),
	],
	[
		'list-style',
		new Map([
			// prettier-ignore
			['list-style-type', true],
			['list-style-position', true],
			['list-style-image', true],
		]),
	],
	[
		'margin',
		new Map([
			// prettier-ignore
			['margin-top', true],
			['margin-right', true],
			['margin-bottom', true],
			['margin-left', true],
		]),
	],
	[
		'margin-block',
		new Map([
			// prettier-ignore
			['margin-block-start', true],
			['margin-block-end', true],
		]),
	],
	[
		'margin-inline',
		new Map([
			// prettier-ignore
			['margin-inline-start', true],
			['margin-inline-end', true],
		]),
	],
	[
		'mask',
		new Map([
			// prettier-ignore
			['mask-image', true],
			['mask-mode', true],
			['mask-position', true],
			['mask-size', true],
			['mask-repeat', true],
			['mask-origin', true],
			['mask-clip', true],
			['mask-composite', true],
		]),
	],
	[
		'outline',
		new Map([
			// prettier-ignore
			['outline-color', true],
			['outline-style', true],
			['outline-width', true],
		]),
	],
	[
		'overflow',
		new Map([
			// prettier-ignore
			['overflow-x', true],
			['overflow-y', true],
		]),
	],
	[
		'overscroll-behavior',
		new Map([
			// prettier-ignore
			['overscroll-behavior-x', true],
			['overscroll-behavior-y', true],
		]),
	],
	[
		'padding',
		new Map([
			// prettier-ignore
			['padding-top', true],
			['padding-right', true],
			['padding-bottom', true],
			['padding-left', true],
		]),
	],
	[
		'padding-block',
		new Map([
			// prettier-ignore
			['padding-block-start', true],
			['padding-block-end', true],
		]),
	],
	[
		'padding-inline',
		new Map([
			// prettier-ignore
			['padding-inline-start', true],
			['padding-inline-end', true],
		]),
	],
	[
		'place-content',
		new Map([
			// prettier-ignore
			['align-content', true],
			['justify-content', true],
		]),
	],
	[
		'place-items',
		new Map([
			// prettier-ignore
			['align-items', true],
			['justify-items', true],
		]),
	],
	[
		'place-self',
		new Map([
			// prettier-ignore
			['align-self', true],
			['justify-self', true],
		]),
	],
	[
		'scroll-margin',
		new Map([
			// prettier-ignore
			['scroll-margin-top', true],
			['scroll-margin-right', true],
			['scroll-margin-bottom', true],
			['scroll-margin-left', true],
		]),
	],
	[
		'scroll-margin-block',
		new Map([
			// prettier-ignore
			['scroll-margin-block-start', true],
			['scroll-margin-block-end', true],
		]),
	],
	[
		'scroll-margin-inline',
		new Map([
			// prettier-ignore
			['scroll-margin-inline-start', true],
			['scroll-margin-inline-end', true],
		]),
	],
	[
		'scroll-padding',
		new Map([
			// prettier-ignore
			['scroll-padding-top', true],
			['scroll-padding-right', true],
			['scroll-padding-bottom', true],
			['scroll-padding-left', true],
		]),
	],
	[
		'scroll-padding-block',
		new Map([
			// prettier-ignore
			['scroll-padding-block-start', true],
			['scroll-padding-block-end', true],
		]),
	],
	[
		'scroll-padding-inline',
		new Map([
			// prettier-ignore
			['scroll-padding-inline-start', true],
			['scroll-padding-inline-end', true],
		]),
	],
	[
		'text-decoration',
		new Map([
			// prettier-ignore
			['text-decoration-line', true],
			['text-decoration-style', true],
			['text-decoration-color', true],
			['text-decoration-thickness', true],
		]),
	],
	[
		'text-emphasis',
		new Map([
			// prettier-ignore
			['text-emphasis-style', true],
			['text-emphasis-color', true],
		]),
	],
	[
		'transition',
		new Map([
			// prettier-ignore
			['transition-property', true],
			['transition-duration', true],
			['transition-timing-function', true],
			['transition-delay', true],
			['transition-behavior', false],
		]),
	],
]);

export const longhandTimeProperties = new Set([
	'transition-duration',
	'transition-delay',
	'animation-duration',
	'animation-delay',
]);

export const shorthandTimeProperties = new Set(['transition', 'animation']);
