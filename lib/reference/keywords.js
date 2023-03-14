'use strict';

const uniteSets = require('../utils/uniteSets.js');

const basicKeywords = new Set(['initial', 'inherit', 'revert', 'revert-layer', 'unset']);

const systemFontKeywords = uniteSets(basicKeywords, [
	'caption',
	'icon',
	'menu',
	'message-box',
	'small-caption',
	'status-bar',
]);

const fontFamilyKeywords = uniteSets(basicKeywords, [
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

const fontWeightRelativeKeywords = new Set(['bolder', 'lighter']);

const fontWeightAbsoluteKeywords = new Set(['normal', 'bold']);

const fontWeightNonNumericKeywords = uniteSets(
	fontWeightRelativeKeywords,
	fontWeightAbsoluteKeywords,
);

const fontWeightNumericKeywords = new Set([
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

const fontWeightKeywords = uniteSets(
	basicKeywords,
	fontWeightNonNumericKeywords,
	fontWeightNumericKeywords,
);

const fontStyleKeywords = uniteSets(basicKeywords, ['normal', 'italic', 'oblique']);

const fontVariantKeywords = uniteSets(basicKeywords, [
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

const fontStretchKeywords = uniteSets(basicKeywords, [
	'semi-condensed',
	'condensed',
	'extra-condensed',
	'ultra-condensed',
	'semi-expanded',
	'expanded',
	'extra-expanded',
	'ultra-expanded',
]);

const fontSizeKeywords = uniteSets(basicKeywords, [
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

const lineHeightKeywords = uniteSets(basicKeywords, ['normal']);

const fontShorthandKeywords = uniteSets(
	basicKeywords,
	fontStyleKeywords,
	fontVariantKeywords,
	fontWeightKeywords,
	fontStretchKeywords,
	fontSizeKeywords,
	lineHeightKeywords,
	fontFamilyKeywords,
);

const animationNameKeywords = uniteSets(basicKeywords, ['none']);

const animationTimingFunctionKeywords = uniteSets(basicKeywords, [
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

const animationIterationCountKeywords = new Set(['infinite']);

const animationDirectionKeywords = uniteSets(basicKeywords, [
	'normal',
	'reverse',
	'alternate',
	'alternate-reverse',
]);

const animationFillModeKeywords = new Set(['none', 'forwards', 'backwards', 'both']);

const animationPlayStateKeywords = uniteSets(basicKeywords, ['running', 'paused']);

// cf. https://developer.mozilla.org/en-US/docs/Web/CSS/animation
const animationShorthandKeywords = uniteSets(
	basicKeywords,
	animationNameKeywords,
	animationTimingFunctionKeywords,
	animationIterationCountKeywords,
	animationDirectionKeywords,
	animationFillModeKeywords,
	animationPlayStateKeywords,
);

const gridRowKeywords = uniteSets(basicKeywords, ['auto', 'span']);

const gridColumnKeywords = uniteSets(basicKeywords, ['auto', 'span']);

const gridAreaKeywords = uniteSets(basicKeywords, ['auto', 'span']);

// https://developer.mozilla.org/docs/Web/CSS/counter-increment
const counterIncrementKeywords = uniteSets(basicKeywords, ['none']);

const counterResetKeywords = uniteSets(basicKeywords, ['none']);

// https://developer.mozilla.org/ru/docs/Web/CSS/list-style-type
const listStyleTypeKeywords = uniteSets(basicKeywords, [
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

const listStylePositionKeywords = uniteSets(basicKeywords, ['inside', 'outside']);

const listStyleImageKeywords = uniteSets(basicKeywords, ['none']);

const listStyleShorthandKeywords = uniteSets(
	basicKeywords,
	listStyleTypeKeywords,
	listStylePositionKeywords,
	listStyleImageKeywords,
);

const camelCaseKeywords = new Set([
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

const keyframeSelectorKeywords = new Set(['from', 'to']);

const systemColorsKeywords = new Set([
	// https://www.w3.org/TR/CSS22/ui.html#system-colors
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
	// https://www.w3.org/TR/css-color-4/#css-system-colors
	'accentcolor',
	'accentcolortext',
	'activetext',
	'buttonborder',
	'buttonface',
	'buttontext',
	'canvas',
	'canvastext',
	'field',
	'fieldtext',
	'graytext',
	'highlight',
	'highlighttext',
	'linktext',
	'mark',
	'marktext',
	'selecteditem',
	'selecteditemtext',
	'visitedtext',
]);

module.exports = {
	animationNameKeywords,
	animationShorthandKeywords,
	basicKeywords,
	camelCaseKeywords,
	counterIncrementKeywords,
	counterResetKeywords,
	fontFamilyKeywords,
	fontShorthandKeywords,
	fontSizeKeywords,
	fontWeightAbsoluteKeywords,
	fontWeightKeywords,
	fontWeightNonNumericKeywords,
	fontWeightRelativeKeywords,
	gridAreaKeywords,
	gridColumnKeywords,
	gridRowKeywords,
	keyframeSelectorKeywords,
	listStyleImageKeywords,
	listStylePositionKeywords,
	listStyleShorthandKeywords,
	listStyleTypeKeywords,
	systemColorsKeywords,
	systemFontKeywords,
};
