'use strict';

const uniteSets = require('../utils/uniteSets.js');

const keywordSets = {};

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

module.exports = keywordSets;
