'use strict';

const htmlTags = require('html-tags');

const keywordSets = {};

keywordSets.nonLengthUnits = new Set([
	// Relative length units
	'%',
	// Time length units
	's',
	'ms',
	// Angle
	'deg',
	'grad',
	'turn',
	'rad',
	// Frequency
	'Hz',
	'kHz',
	// Resolution
	'dpi',
	'dpcm',
	'dppx',
]);

keywordSets.lengthUnits = new Set([
	// Relative length units
	'em',
	'ex',
	'ch',
	'rem',
	'rlh',
	'lh',
	// Viewport-percentage lengths
	'dvh',
	'dvmax',
	'dvmin',
	'dvw',
	'lvh',
	'lvmax',
	'lvmin',
	'lvw',
	'svh',
	'svmax',
	'svmin',
	'svw',
	'vh',
	'vw',
	'vmin',
	'vmax',
	'vm',
	// Absolute length units
	'px',
	'mm',
	'cm',
	'in',
	'pt',
	'pc',
	'q',
	'mozmm',
	// Flexible length units
	'fr',
]);

keywordSets.units = uniteSets(keywordSets.nonLengthUnits, keywordSets.lengthUnits);

keywordSets.camelCaseFunctionNames = new Set([
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

keywordSets.basicKeywords = new Set(['initial', 'inherit', 'revert', 'revert-layer', 'unset']);

keywordSets.systemFontValues = uniteSets(keywordSets.basicKeywords, [
	'caption',
	'icon',
	'menu',
	'message-box',
	'small-caption',
	'status-bar',
]);

keywordSets.fontFamilyKeywords = uniteSets(keywordSets.basicKeywords, [
	'serif',
	'sans-serif',
	'cursive',
	'fantasy',
	'monospace',
	'system-ui',
	'ui-serif',
	'ui-sans-serif',
	'ui-monospace',
	'ui-rounded',
]);

keywordSets.fontWeightRelativeKeywords = new Set(['bolder', 'lighter']);

keywordSets.fontWeightAbsoluteKeywords = new Set(['bold']);

keywordSets.fontWeightNumericKeywords = new Set([
	'100',
	'200',
	'300',
	'400',
	'500',
	'600',
	'700',
	'800',
	'900',
]);

keywordSets.fontWeightKeywords = uniteSets(
	keywordSets.basicKeywords,
	keywordSets.fontWeightRelativeKeywords,
	keywordSets.fontWeightAbsoluteKeywords,
	keywordSets.fontWeightNumericKeywords,
);

keywordSets.animationNameKeywords = uniteSets(keywordSets.basicKeywords, ['none']);

keywordSets.animationTimingFunctionKeywords = uniteSets(keywordSets.basicKeywords, [
	'linear',
	'ease',
	'ease-in',
	'ease-in-out',
	'ease-out',
	'step-start',
	'step-end',
	'steps',
	'cubic-bezier',
]);

keywordSets.animationIterationCountKeywords = new Set(['infinite']);

keywordSets.animationDirectionKeywords = uniteSets(keywordSets.basicKeywords, [
	'normal',
	'reverse',
	'alternate',
	'alternate-reverse',
]);

keywordSets.animationFillModeKeywords = new Set(['none', 'forwards', 'backwards', 'both']);

keywordSets.animationPlayStateKeywords = uniteSets(keywordSets.basicKeywords, [
	'running',
	'paused',
]);

// cf. https://developer.mozilla.org/en-US/docs/Web/CSS/animation
keywordSets.animationShorthandKeywords = uniteSets(
	keywordSets.basicKeywords,
	keywordSets.animationNameKeywords,
	keywordSets.animationTimingFunctionKeywords,
	keywordSets.animationIterationCountKeywords,
	keywordSets.animationDirectionKeywords,
	keywordSets.animationFillModeKeywords,
	keywordSets.animationPlayStateKeywords,
);

// These are the ones that can have single-colon notation
keywordSets.levelOneAndTwoPseudoElements = new Set([
	'before',
	'after',
	'first-line',
	'first-letter',
]);

keywordSets.levelThreeAndUpPseudoElements = new Set([
	'before',
	'after',
	'first-line',
	'first-letter',
	// These are the ones that require double-colon notation
	'backdrop',
	'content',
	'cue',
	'file-selector-button',
	'grammar-error',
	'marker',
	'placeholder',
	'selection',
	'shadow',
	'slotted',
	'spelling-error',
	'target-text',
]);

keywordSets.shadowTreePseudoElements = new Set(['part']);

keywordSets.webkitScrollbarPseudoElements = new Set([
	'-webkit-resizer',
	'-webkit-scrollbar',
	'-webkit-scrollbar-button',
	'-webkit-scrollbar-corner',
	'-webkit-scrollbar-thumb',
	'-webkit-scrollbar-track',
	'-webkit-scrollbar-track-piece',
]);

keywordSets.vendorSpecificPseudoElements = new Set([
	'-moz-focus-inner',
	'-moz-focus-outer',
	'-moz-list-bullet',
	'-moz-meter-bar',
	'-moz-placeholder',
	'-moz-progress-bar',
	'-moz-range-progress',
	'-moz-range-thumb',
	'-moz-range-track',
	'-ms-browse',
	'-ms-check',
	'-ms-clear',
	'-ms-expand',
	'-ms-fill',
	'-ms-fill-lower',
	'-ms-fill-upper',
	'-ms-reveal',
	'-ms-thumb',
	'-ms-ticks-after',
	'-ms-ticks-before',
	'-ms-tooltip',
	'-ms-track',
	'-ms-value',
	'-webkit-color-swatch',
	'-webkit-color-swatch-wrapper',
	'-webkit-calendar-picker-indicator',
	'-webkit-clear-button',
	'-webkit-date-and-time-value',
	'-webkit-datetime-edit',
	'-webkit-datetime-edit-ampm-field',
	'-webkit-datetime-edit-day-field',
	'-webkit-datetime-edit-fields-wrapper',
	'-webkit-datetime-edit-hour-field',
	'-webkit-datetime-edit-millisecond-field',
	'-webkit-datetime-edit-minute-field',
	'-webkit-datetime-edit-month-field',
	'-webkit-datetime-edit-second-field',
	'-webkit-datetime-edit-text',
	'-webkit-datetime-edit-week-field',
	'-webkit-datetime-edit-year-field',
	'-webkit-details-marker',
	'-webkit-distributed',
	'-webkit-file-upload-button',
	'-webkit-input-placeholder',
	'-webkit-keygen-select',
	'-webkit-meter-bar',
	'-webkit-meter-even-less-good-value',
	'-webkit-meter-inner-element',
	'-webkit-meter-optimum-value',
	'-webkit-meter-suboptimum-value',
	'-webkit-progress-bar',
	'-webkit-progress-inner-element',
	'-webkit-progress-value',
	'-webkit-search-cancel-button',
	'-webkit-search-decoration',
	'-webkit-search-results-button',
	'-webkit-search-results-decoration',
	'-webkit-slider-runnable-track',
	'-webkit-slider-thumb',
	'-webkit-textfield-decoration-container',
	'-webkit-validation-bubble',
	'-webkit-validation-bubble-arrow',
	'-webkit-validation-bubble-arrow-clipper',
	'-webkit-validation-bubble-heading',
	'-webkit-validation-bubble-message',
	'-webkit-validation-bubble-text-block',
	...keywordSets.webkitScrollbarPseudoElements,
]);

keywordSets.pseudoElements = uniteSets(
	keywordSets.levelOneAndTwoPseudoElements,
	keywordSets.levelThreeAndUpPseudoElements,
	keywordSets.vendorSpecificPseudoElements,
	keywordSets.shadowTreePseudoElements,
);

keywordSets.aNPlusBNotationPseudoClasses = new Set([
	'nth-column',
	'nth-last-column',
	'nth-last-of-type',
	'nth-of-type',
]);

keywordSets.linguisticPseudoClasses = new Set(['dir', 'lang']);

keywordSets.atRulePagePseudoClasses = new Set(['first', 'right', 'left', 'blank']);

keywordSets.logicalCombinationsPseudoClasses = new Set(['has', 'is', 'matches', 'not', 'where']);

keywordSets.aNPlusBOfSNotationPseudoClasses = new Set(['nth-child', 'nth-last-child']);

keywordSets.otherPseudoClasses = new Set([
	'active',
	'any-link',
	'autofill',
	'blank',
	'checked',
	'current',
	'default',
	'defined',
	'disabled',
	'empty',
	'enabled',
	'first-child',
	'first-of-type',
	'focus',
	'focus-within',
	'focus-visible',
	'fullscreen',
	'fullscreen-ancestor',
	'future',
	'host',
	'host-context',
	'hover',
	'indeterminate',
	'in-range',
	'invalid',
	'last-child',
	'last-of-type',
	'link',
	'only-child',
	'only-of-type',
	'optional',
	'out-of-range',
	'past',
	'placeholder-shown',
	'playing',
	'picture-in-picture',
	'paused',
	'read-only',
	'read-write',
	'required',
	'root',
	'scope',
	'state',
	'target',
	'unresolved',
	'user-invalid',
	'user-valid',
	'valid',
	'visited',
	'window-inactive', // for ::selection (chrome)
]);

keywordSets.vendorSpecificPseudoClasses = new Set([
	'-khtml-drag',
	'-moz-any',
	'-moz-any-link',
	'-moz-broken',
	'-moz-drag-over',
	'-moz-first-node',
	'-moz-focusring',
	'-moz-full-screen',
	'-moz-full-screen-ancestor',
	'-moz-last-node',
	'-moz-loading',
	'-moz-meter-optimum',
	'-moz-meter-sub-optimum',
	'-moz-meter-sub-sub-optimum',
	'-moz-placeholder',
	'-moz-submit-invalid',
	'-moz-suppressed',
	'-moz-ui-invalid',
	'-moz-ui-valid',
	'-moz-user-disabled',
	'-moz-window-inactive',
	'-ms-fullscreen',
	'-ms-input-placeholder',
	'-webkit-drag',
	'-webkit-any',
	'-webkit-any-link',
	'-webkit-autofill',
	'-webkit-full-screen',
	'-webkit-full-screen-ancestor',
]);

// https://webkit.org/blog/363/styling-scrollbars/
keywordSets.webkitScrollbarPseudoClasses = new Set([
	'horizontal',
	'vertical',
	'decrement',
	'increment',
	'start',
	'end',
	'double-button',
	'single-button',
	'no-button',
	'corner-present',
	'window-inactive',
]);

keywordSets.pseudoClasses = uniteSets(
	keywordSets.aNPlusBNotationPseudoClasses,
	keywordSets.linguisticPseudoClasses,
	keywordSets.logicalCombinationsPseudoClasses,
	keywordSets.aNPlusBOfSNotationPseudoClasses,
	keywordSets.otherPseudoClasses,
	keywordSets.vendorSpecificPseudoClasses,
);

keywordSets.shorthandTimeProperties = new Set(['transition', 'animation']);

keywordSets.longhandTimeProperties = new Set([
	'transition-duration',
	'transition-delay',
	'animation-duration',
	'animation-delay',
]);

keywordSets.timeProperties = uniteSets(
	keywordSets.shorthandTimeProperties,
	keywordSets.longhandTimeProperties,
);

keywordSets.camelCaseKeywords = new Set([
	'optimizeSpeed',
	'optimizeQuality',
	'optimizeLegibility',
	'geometricPrecision',
	'currentColor',
	'crispEdges',
	'visiblePainted',
	'visibleFill',
	'visibleStroke',
	'sRGB',
	'linearRGB',
]);

// https://developer.mozilla.org/docs/Web/CSS/counter-increment
keywordSets.counterIncrementKeywords = uniteSets(keywordSets.basicKeywords, ['none']);

keywordSets.counterResetKeywords = uniteSets(keywordSets.basicKeywords, ['none']);

keywordSets.gridRowKeywords = uniteSets(keywordSets.basicKeywords, ['auto', 'span']);

keywordSets.gridColumnKeywords = uniteSets(keywordSets.basicKeywords, ['auto', 'span']);

keywordSets.gridAreaKeywords = uniteSets(keywordSets.basicKeywords, ['auto', 'span']);

// https://developer.mozilla.org/ru/docs/Web/CSS/list-style-type
keywordSets.listStyleTypeKeywords = uniteSets(keywordSets.basicKeywords, [
	'none',
	'disc',
	'circle',
	'square',
	'decimal',
	'cjk-decimal',
	'decimal-leading-zero',
	'lower-roman',
	'upper-roman',
	'lower-greek',
	'lower-alpha',
	'lower-latin',
	'upper-alpha',
	'upper-latin',
	'arabic-indic',
	'armenian',
	'bengali',
	'cambodian',
	'cjk-earthly-branch',
	'cjk-ideographic',
	'devanagari',
	'ethiopic-numeric',
	'georgian',
	'gujarati',
	'gurmukhi',
	'hebrew',
	'hiragana',
	'hiragana-iroha',
	'japanese-formal',
	'japanese-informal',
	'kannada',
	'katakana',
	'katakana-iroha',
	'khmer',
	'korean-hangul-formal',
	'korean-hanja-formal',
	'korean-hanja-informal',
	'lao',
	'lower-armenian',
	'malayalam',
	'mongolian',
	'myanmar',
	'oriya',
	'persian',
	'simp-chinese-formal',
	'simp-chinese-informal',
	'tamil',
	'telugu',
	'thai',
	'tibetan',
	'trad-chinese-formal',
	'trad-chinese-informal',
	'upper-armenian',
	'disclosure-open',
	'disclosure-closed',
	// Non-standard extensions (without prefixe)
	'ethiopic-halehame',
	'ethiopic-halehame-am',
	'ethiopic-halehame-ti-er',
	'ethiopic-halehame-ti-et',
	'hangul',
	'hangul-consonant',
	'urdu',
]);

keywordSets.listStylePositionKeywords = uniteSets(keywordSets.basicKeywords, ['inside', 'outside']);

keywordSets.listStyleImageKeywords = uniteSets(keywordSets.basicKeywords, ['none']);

keywordSets.listStyleShorthandKeywords = uniteSets(
	keywordSets.basicKeywords,
	keywordSets.listStyleTypeKeywords,
	keywordSets.listStylePositionKeywords,
	keywordSets.listStyleImageKeywords,
);

keywordSets.fontStyleKeywords = uniteSets(keywordSets.basicKeywords, [
	'normal',
	'italic',
	'oblique',
]);

keywordSets.fontVariantKeywords = uniteSets(keywordSets.basicKeywords, [
	'normal',
	'none',
	'historical-forms',
	'none',
	'common-ligatures',
	'no-common-ligatures',
	'discretionary-ligatures',
	'no-discretionary-ligatures',
	'historical-ligatures',
	'no-historical-ligatures',
	'contextual',
	'no-contextual',
	'small-caps',
	'small-caps',
	'all-small-caps',
	'petite-caps',
	'all-petite-caps',
	'unicase',
	'titling-caps',
	'lining-nums',
	'oldstyle-nums',
	'proportional-nums',
	'tabular-nums',
	'diagonal-fractions',
	'stacked-fractions',
	'ordinal',
	'slashed-zero',
	'jis78',
	'jis83',
	'jis90',
	'jis04',
	'simplified',
	'traditional',
	'full-width',
	'proportional-width',
	'ruby',
]);

keywordSets.fontStretchKeywords = uniteSets(keywordSets.basicKeywords, [
	'semi-condensed',
	'condensed',
	'extra-condensed',
	'ultra-condensed',
	'semi-expanded',
	'expanded',
	'extra-expanded',
	'ultra-expanded',
]);

keywordSets.fontSizeKeywords = uniteSets(keywordSets.basicKeywords, [
	'xx-small',
	'x-small',
	'small',
	'medium',
	'large',
	'x-large',
	'xx-large',
	'larger',
	'smaller',
]);

keywordSets.lineHeightKeywords = uniteSets(keywordSets.basicKeywords, ['normal']);

keywordSets.fontShorthandKeywords = uniteSets(
	keywordSets.basicKeywords,
	keywordSets.fontStyleKeywords,
	keywordSets.fontVariantKeywords,
	keywordSets.fontWeightKeywords,
	keywordSets.fontStretchKeywords,
	keywordSets.fontSizeKeywords,
	keywordSets.lineHeightKeywords,
	keywordSets.fontFamilyKeywords,
);

keywordSets.keyframeSelectorKeywords = new Set(['from', 'to']);

// https://www.w3.org/TR/css-page-3/#syntax-page-selector
keywordSets.pageMarginAtRules = new Set([
	'top-left-corner',
	'top-left',
	'top-center',
	'top-right',
	'top-right-corner',
	'bottom-left-corner',
	'bottom-left',
	'bottom-center',
	'bottom-right',
	'bottom-right-corner',
	'left-top',
	'left-middle',
	'left-bottom',
	'right-top',
	'right-middle',
	'right-bottom',
]);

// https://developer.mozilla.org/en/docs/Web/CSS/At-rule
keywordSets.atRules = uniteSets(keywordSets.pageMarginAtRules, [
	'annotation',
	'apply',
	'character-variant',
	'charset',
	'counter-style',
	'custom-media',
	'custom-selector',
	'document',
	'font-face',
	'font-feature-values',
	'import',
	'keyframes',
	'layer',
	'media',
	'namespace',
	'nest',
	'ornaments',
	'page',
	'property',
	'styleset',
	'stylistic',
	'supports',
	'swash',
	'viewport',
]);

// https://drafts.csswg.org/mediaqueries/#descdef-media-update
keywordSets.deprecatedMediaFeatureNames = new Set([
	'device-aspect-ratio',
	'device-height',
	'device-width',
	'max-device-aspect-ratio',
	'max-device-height',
	'max-device-width',
	'min-device-aspect-ratio',
	'min-device-height',
	'min-device-width',
]);

// https://drafts.csswg.org/mediaqueries/#descdef-media-update
keywordSets.mediaFeatureNames = uniteSets(keywordSets.deprecatedMediaFeatureNames, [
	'any-hover',
	'any-pointer',
	'aspect-ratio',
	'color',
	'color-gamut',
	'color-index',
	'display-mode',
	'dynamic-range',
	'forced-colors',
	'grid',
	'height',
	'hover',
	'inverted-colors',
	'light-level',
	'max-aspect-ratio',
	'max-color',
	'max-color-index',
	'max-height',
	'max-monochrome',
	'max-resolution',
	'max-width',
	'min-aspect-ratio',
	'min-color',
	'min-color-index',
	'min-height',
	'min-monochrome',
	'min-resolution',
	'min-width',
	'monochrome',
	'orientation',
	'overflow-block',
	'overflow-inline',
	'pointer',
	'prefers-color-scheme',
	'prefers-contrast',
	'prefers-reduced-motion',
	'prefers-reduced-transparency',
	'resolution',
	'scan',
	'scripting',
	'update',
	'video-dynamic-range',
	'width',
]);

// https://www.w3.org/TR/CSS22/ui.html#system-colors
keywordSets.systemColors = new Set([
	'activeborder',
	'activecaption',
	'appworkspace',
	'background',
	'buttonface',
	'buttonhighlight',
	'buttonshadow',
	'buttontext',
	'captiontext',
	'graytext',
	'highlight',
	'highlighttext',
	'inactiveborder',
	'inactivecaption',
	'inactivecaptiontext',
	'infobackground',
	'infotext',
	'menu',
	'menutext',
	'scrollbar',
	'threeddarkshadow',
	'threedface',
	'threedhighlight',
	'threedlightshadow',
	'threedshadow',
	'window',
	'windowframe',
	'windowtext',
]);

// typecasting htmlTags to be more generic; see https://github.com/stylelint/stylelint/pull/6013 for discussion
/** @type {Set<string>} */
keywordSets.standardHtmlTags = new Set(htmlTags);

// htmlTags includes only "standard" tags. So we augment it with older tags etc.
keywordSets.nonStandardHtmlTags = new Set([
	'acronym',
	'applet',
	'basefont',
	'big',
	'blink',
	'center',
	'content',
	'dir',
	'font',
	'frame',
	'frameset',
	'hgroup',
	'isindex',
	'keygen',
	'listing',
	'marquee',
	'nobr',
	'noembed',
	'plaintext',
	'spacer',
	'strike',
	'tt',
	'xmp',
]);

keywordSets.validMixedCaseSvgElements = new Set([
	'altGlyph',
	'altGlyphDef',
	'altGlyphItem',
	'animateColor',
	'animateMotion',
	'animateTransform',
	'clipPath',
	'feBlend',
	'feColorMatrix',
	'feComponentTransfer',
	'feComposite',
	'feConvolveMatrix',
	'feDiffuseLighting',
	'feDisplacementMap',
	'feDistantLight',
	'feDropShadow',
	'feFlood',
	'feFuncA',
	'feFuncB',
	'feFuncG',
	'feFuncR',
	'feGaussianBlur',
	'feImage',
	'feMerge',
	'feMergeNode',
	'feMorphology',
	'feOffset',
	'fePointLight',
	'feSpecularLighting',
	'feSpotLight',
	'feTile',
	'feTurbulence',
	'foreignObject',
	'glyphRef',
	'linearGradient',
	'radialGradient',
	'textPath',
]);

/**
 * @param {(string[] | Set<string>)[]} args
 */
function uniteSets(...args) {
	return new Set([...args].reduce((result, set) => [...result, ...set], []));
}

module.exports = keywordSets;
