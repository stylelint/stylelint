/** @type {ReadonlySet<string>} */
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

/** @type {ReadonlyMap<string, ReadonlySet<string>>} */
export const shorthandToResetToInitialProperty = new Map([
	[
		'border',
		new Set([
			'border-image',
			'border-image-outset',
			'border-image-repeat',
			'border-image-slice',
			'border-image-source',
			'border-image-width',
		]),
	],
	[
		/** @see https://www.w3.org/TR/css-fonts-4/#font-prop */
		'font',
		new Set([
			// prettier-ignore
			'font-feature-settings',
			'font-kerning',
			'font-language-override',
			'font-optical-sizing',
			'font-size-adjust',
			'font-variant-alternates',
			'font-variant-caps',
			'font-variant-east-asian',
			'font-variant-emoji',
			'font-variant-ligatures',
			'font-variant-numeric',
			'font-variant-position',
			'font-variation-settings',
		]),
	],
]);

/** @type {import('stylelint').LonghandSubPropertiesOfShorthandProperties} */
export const longhandSubPropertiesOfShorthandProperties = new Map([
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
			'border-width',
			'border-style',
			'border-color',
		]),
	],
	[
		'border-block',
		new Set([
			// prettier-ignore
			'border-block-width',
			'border-block-style',
			'border-block-color',
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
		'border-inline',
		new Set([
			// prettier-ignore
			'border-inline-width',
			'border-inline-style',
			'border-inline-color',
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
			'border-top-left-radius',
			'border-top-right-radius',
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
			'border-right-width',
			'border-bottom-width',
			'border-left-width',
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
			/**
			 * reset explicitly: normal | small-caps
			 * reset implicitly: all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps
			 * i.e. either way it will be reset
			 * {@link https://www.w3.org/TR/css-fonts-4/#font-variant-prop World Wide Web Consortium}
			 */
			'font-variant',
			'font-weight',
			'font-stretch',
			'font-size',
			'line-height',
			'font-family',
		]),
	],
	[
		'font-synthesis',
		new Set([
			// prettier-ignore
			'font-synthesis-weight',
			'font-synthesis-style',
			'font-synthesis-small-caps',
		]),
	],
	[
		'font-variant',
		new Set([
			// prettier-ignore
			'font-variant-ligatures',
			'font-variant-position',
			'font-variant-caps',
			'font-variant-numeric',
			'font-variant-alternates',
			'font-variant-east-asian',
			'font-variant-emoji',
		]),
	],
	[
		'gap',
		new Set([
			// prettier-ignore
			'row-gap',
			'column-gap',
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
		'inset-block',
		new Set([
			// prettier-ignore
			'inset-block-start',
			'inset-block-end',
		]),
	],
	[
		'inset-inline',
		new Set([
			// prettier-ignore
			'inset-inline-start',
			'inset-inline-end',
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
		'margin-block',
		new Set([
			// prettier-ignore
			'margin-block-start',
			'margin-block-end',
		]),
	],
	[
		'margin-inline',
		new Set([
			// prettier-ignore
			'margin-inline-start',
			'margin-inline-end',
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
		'overflow',
		new Set([
			// prettier-ignore
			'overflow-x',
			'overflow-y',
		]),
	],
	[
		'overscroll-behavior',
		new Set([
			// prettier-ignore
			'overscroll-behavior-x',
			'overscroll-behavior-y',
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
		'padding-block',
		new Set([
			// prettier-ignore
			'padding-block-start',
			'padding-block-end',
		]),
	],
	[
		'padding-inline',
		new Set([
			// prettier-ignore
			'padding-inline-start',
			'padding-inline-end',
		]),
	],
	[
		'place-content',
		new Set([
			// prettier-ignore
			'align-content',
			'justify-content',
		]),
	],
	[
		'place-items',
		new Set([
			// prettier-ignore
			'align-items',
			'justify-items',
		]),
	],
	[
		'place-self',
		new Set([
			// prettier-ignore
			'align-self',
			'justify-self',
		]),
	],
	[
		'scroll-margin',
		new Set([
			// prettier-ignore
			'scroll-margin-top',
			'scroll-margin-right',
			'scroll-margin-bottom',
			'scroll-margin-left',
		]),
	],
	[
		'scroll-margin-block',
		new Set([
			// prettier-ignore
			'scroll-margin-block-start',
			'scroll-margin-block-end',
		]),
	],
	[
		'scroll-margin-inline',
		new Set([
			// prettier-ignore
			'scroll-margin-inline-start',
			'scroll-margin-inline-end',
		]),
	],
	[
		'scroll-padding',
		new Set([
			// prettier-ignore
			'scroll-padding-top',
			'scroll-padding-right',
			'scroll-padding-bottom',
			'scroll-padding-left',
		]),
	],
	[
		'scroll-padding-block',
		new Set([
			// prettier-ignore
			'scroll-padding-block-start',
			'scroll-padding-block-end',
		]),
	],
	[
		'scroll-padding-inline',
		new Set([
			// prettier-ignore
			'scroll-padding-inline-start',
			'scroll-padding-inline-end',
		]),
	],
	[
		'text-decoration',
		new Set([
			// prettier-ignore
			'text-decoration-line',
			'text-decoration-style',
			'text-decoration-color',
			'text-decoration-thickness',
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

/** @type {ReadonlySet<string>} */
export const singleValueColorProperties = new Set([
	'accent-color',
	'background-color',
	'border-block-color',
	'border-block-end-color',
	'border-block-start-color',
	'border-bottom-color',
	'border-inline-color',
	'border-inline-end-color',
	'border-inline-start-color',
	'border-left-color',
	'border-right-color',
	'border-top-color',
	'caret-color',
	'color',
	'column-rule-color',
	'outline-color',
	'text-decoration-color',
	'text-emphasis-color',
	// SVG
	'flood-color',
	'lighting-color',
	'stop-color',
]);

/** @type {ReadonlySet<string>} */
export const multiValueColorProperties = new Set(['border-color', 'scrollbar-color']);

/** @type {ReadonlySet<string>} */
export const colorProperties = new Set([
	...singleValueColorProperties,
	...multiValueColorProperties,
]);

/** @type {ReadonlySet<string>} */
export const longhandTimeProperties = new Set([
	'transition-duration',
	'transition-delay',
	'animation-duration',
	'animation-delay',
]);

/** @type {ReadonlySet<string>} */
export const shorthandTimeProperties = new Set(['transition', 'animation']);

/** @type {ReadonlySet<string>} */
export const pageContextProperties = new Set([
	'direction',
	'background-color',
	'background-image',
	'background-repeat',
	'background-attachment',
	'background-position',
	'background',
	'border-top-width',
	'border-right-width',
	'border-bottom-width',
	'border-left-width',
	'border-width',
	'border-top-color',
	'border-right-color',
	'border-bottom-color',
	'border-left-color',
	'border-color',
	'border-top-style',
	'border-right-style',
	'border-bottom-style',
	'border-left-style',
	'border-style',
	'border-top',
	'border-right',
	'border-bottom',
	'border-left',
	'border',
	'counter-reset',
	'counter-increment',
	'color',
	'font-family',
	'font-size',
	'font-style',
	'font-variant',
	'font-weight',
	'font',
	'height',
	'min-height',
	'max-height',
	'line-height',
	'margin-top',
	'margin-right',
	'margin-bottom',
	'margin-left',
	'margin',
	'outline-width',
	'outline-style',
	'outline-color',
	'outline',
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
	'padding',
	'quotes',
	'letter-spacing',
	'text-align',
	'text-decoration',
	'text-indent',
	'text-transform',
	'white-space',
	'word-spacing',
	'visibility',
	'width',
	'min-width',
	'max-width',
]);

/** @type {ReadonlySet<string>} */
export const marginContextProperties = new Set([
	'direction',
	'unicode-bidi',
	'background-color',
	'background-image',
	'background-repeat',
	'background-attachment',
	'background-position',
	'background',
	'border-top-width',
	'border-right-width',
	'border-bottom-width',
	'border-left-width',
	'border-width',
	'border-top-color',
	'border-right-color',
	'border-bottom-color',
	'border-left-color',
	'border-color',
	'border-top-style',
	'border-right-style',
	'border-bottom-style',
	'border-left-style',
	'border-style',
	'border-top',
	'border-right',
	'border-bottom',
	'border-left',
	'border',
	'counter-reset',
	'counter-increment',
	'content',
	'color',
	'font-family',
	'font-size',
	'font-style',
	'font-variant',
	'font-weight',
	'font',
	'height',
	'min-height',
	'max-height',
	'line-height',
	'margin-top',
	'margin-right',
	'margin-bottom',
	'margin-left',
	'margin',
	'outline-width',
	'outline-style',
	'outline-color',
	'outline',
	'overflow',
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
	'padding',
	'quotes',
	'letter-spacing',
	'text-align',
	'text-decoration',
	'text-indent',
	'text-transform',
	'white-space',
	'word-spacing',
	'vertical-align',
	'visibility',
	'width',
	'min-width',
	'max-width',
	'z-index',
]);

// Known from before migrating to CSSTree
// @see https://github.com/stylelint/stylelint/issues/9065
/** @type {ReadonlySet<string>} */
export const previouslyKnownProperties = new Set([
	'acelerator',
	'additive-symbols',
	'alt',
	'animation-trigger-behavior',
	'animation-trigger-exit-range',
	'animation-trigger-exit-range-end',
	'animation-trigger-exit-range-start',
	'animation-trigger-range',
	'animation-trigger-range-end',
	'animation-trigger-range-start',
	'animation-trigger-timeline',
	'app-region',
	'ascent-override',
	'audio-level',
	'base-palette',
	'buffered-rendering',
	'chains',
	'color-profile',
	'color-rendering',
	'column-progression',
	'column-rule-outset',
	'descent-override',
	'display-align',
	'elevation',
	'enable-background',
	'epub-caption-side',
	'epub-hyphens',
	'epub-text-combine',
	'epub-text-emphasis',
	'epub-text-emphasis-color',
	'epub-text-emphasis-style',
	'epub-text-orientation',
	'epub-text-transform',
	'epub-word-break',
	'epub-writing-mode',
	'fallback',
	'flow',
	'font-display',
	'inherits',
	'initial-value',
	'input-format',
	'inset-area',
	'item-slack',
	'layout-flow',
	'layout-grid',
	'layout-grid-char',
	'layout-grid-line',
	'layout-grid-mode',
	'layout-grid-type',
	'line-gap-override',
	'line-increment',
	'marker-knockout-left',
	'marker-knockout-right',
	'marker-offset',
	'marker-pattern',
	'marker-segment',
	'marks',
	'mask-position-x',
	'mask-position-y',
	'mask-source-type',
	'max-zoom',
	'min-zoom',
	'motion',
	'motion-offset',
	'motion-path',
	'motion-rotation',
	'nav-down',
	'nav-index',
	'nav-left',
	'nav-right',
	'nav-up',
	'navigation',
	'negative',
	'offset-block-end',
	'offset-block-start',
	'offset-inline-end',
	'offset-inline-start',
	'offset-rotation',
	'orientation',
	'override-colors',
	'pad',
	'page-orientation',
	'pen-action',
	'perspective-origin-x',
	'perspective-origin-y',
	'pitch',
	'pitch-range',
	'play-during',
	'position-try-options',
	'prefix',
	'property-name',
	'range',
	'richness',
	'row-rule-outset',
	'rule-outset',
	'rule-paint-order',
	'running',
	'scroll-snap-margin',
	'scroll-snap-margin-bottom',
	'scroll-snap-margin-left',
	'scroll-snap-margin-right',
	'scroll-snap-margin-top',
	'scroll-start-target',
	'scrollbar-arrow-color',
	'scrollbar-base-color',
	'scrollbar-dark-shadow-color',
	'scrollbar-darkshadow-color',
	'scrollbar-face-color',
	'scrollbar-highlight-color',
	'scrollbar-shadow-color',
	'scrollbar-track-color',
	'scrollbar3d-light-color',
	'scrollbar3dlight-color',
	'size',
	'size-adjust',
	'snap-height',
	'solid-color',
	'solid-opacity',
	'speak-header',
	'speak-numeral',
	'speak-punctuation',
	'speech-rate',
	'stress',
	'suffix',
	'supported-color-schemes',
	'symbols',
	'syntax',
	'system',
	'text-decoration-blink',
	'text-decoration-line-through',
	'text-decoration-none',
	'text-decoration-overline',
	'text-decoration-skip-inset',
	'text-decoration-trim',
	'text-decoration-underline',
	'text-justify-trim',
	'text-kashida',
	'text-kashida-space',
	'text-line-through',
	'text-line-through-color',
	'text-line-through-mode',
	'text-line-through-style',
	'text-line-through-width',
	'text-overline',
	'text-overline-color',
	'text-overline-mode',
	'text-overline-style',
	'text-overline-width',
	'text-underline',
	'text-underline-color',
	'text-underline-mode',
	'text-underline-style',
	'text-underline-width',
	'touch-action-delay',
	'transform-origin-x',
	'transform-origin-y',
	'transform-origin-z',
	'types',
	'uc-alt-skin',
	'uc-skin',
	'user-zoom',
	'viewport-fill',
	'viewport-fill-opacity',
	'viewport-fit',
	'volume',
]);
