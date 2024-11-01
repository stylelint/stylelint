import uniteSets from '../utils/uniteSets.mjs';

export const basicKeywords = new Set(['initial', 'inherit', 'revert', 'revert-layer', 'unset']);

export const systemFontKeywords = uniteSets(basicKeywords, [
	'caption',
	'icon',
	'menu',
	'message-box',
	'small-caption',
	'status-bar',
]);

export const fontFamilyKeywords = uniteSets(basicKeywords, [
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

const appleSystemFonts = new Set([
	'-apple-system',
	'-apple-system-headline',
	'-apple-system-body',
	'-apple-system-subheadline',
	'-apple-system-footnote',
	'-apple-system-caption1',
	'-apple-system-caption2',
	'-apple-system-short-headline',
	'-apple-system-short-body',
	'-apple-system-short-subheadline',
	'-apple-system-short-footnote',
	'-apple-system-short-caption1',
	'-apple-system-tall-body',
	'-apple-system-title0',
	'-apple-system-title1',
	'-apple-system-title2',
	'-apple-system-title3',
	'-apple-system-title4',
]);

const mozillaSystemFonts = new Set([
	'-moz-button',
	'-moz-desktop',
	'-moz-dialog',
	'-moz-document',
	'-moz-field',
	'-moz-fixed',
	'-moz-info',
	'-moz-list',
	'-moz-pull-down-menu',
	'-moz-window',
	'-moz-workspace',
]);

const webkitSystemFonts = new Set([
	'-webkit-body',
	'-webkit-control',
	'-webkit-mini-control',
	'-webkit-pictograph',
	'-webkit-small-control',
	'-webkit-standard',
]);

export const prefixedSystemFonts = uniteSets(
	appleSystemFonts,
	mozillaSystemFonts,
	webkitSystemFonts,
);

export const fontWeightRelativeKeywords = new Set(['bolder', 'lighter']);

export const fontWeightAbsoluteKeywords = new Set(['normal', 'bold']);

export const fontWeightNonNumericKeywords = uniteSets(
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

export const fontWeightKeywords = uniteSets(
	basicKeywords,
	fontWeightNonNumericKeywords,
	fontWeightNumericKeywords,
);

const fontStyleKeywords = uniteSets(basicKeywords, ['normal', 'italic', 'oblique']);

const fontVariantCSS2Keywords = uniteSets(basicKeywords, ['normal', 'none', 'small-caps']);

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

export const fontSizeKeywords = uniteSets(basicKeywords, [
	'xx-small',
	'x-small',
	'small',
	'medium',
	'large',
	'x-large',
	'xx-large',
	'xxx-large',
	'larger',
	'smaller',
	'math',
]);

const lineHeightKeywords = uniteSets(basicKeywords, ['normal']);

export const fontShorthandKeywords = uniteSets(
	basicKeywords,
	fontStyleKeywords,
	fontVariantCSS2Keywords,
	fontWeightKeywords,
	fontStretchKeywords,
	fontSizeKeywords,
	lineHeightKeywords,
	fontFamilyKeywords,
);

export const animationNameKeywords = uniteSets(basicKeywords, ['none']);

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
export const animationShorthandKeywords = uniteSets(
	basicKeywords,
	animationNameKeywords,
	animationTimingFunctionKeywords,
	animationIterationCountKeywords,
	animationDirectionKeywords,
	animationFillModeKeywords,
	animationPlayStateKeywords,
);

export const gridRowKeywords = uniteSets(basicKeywords, ['auto', 'span']);

export const gridColumnKeywords = uniteSets(basicKeywords, ['auto', 'span']);

export const gridAreaKeywords = uniteSets(basicKeywords, ['auto', 'span']);

// https://developer.mozilla.org/docs/Web/CSS/counter-increment
export const counterIncrementKeywords = uniteSets(basicKeywords, ['none']);

export const counterResetKeywords = uniteSets(basicKeywords, ['none']);

// https://developer.mozilla.org/ru/docs/Web/CSS/list-style-type
export const listStyleTypeKeywords = uniteSets(basicKeywords, [
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

export const listStylePositionKeywords = uniteSets(basicKeywords, ['inside', 'outside']);

export const listStyleImageKeywords = uniteSets(basicKeywords, ['none']);

export const listStyleShorthandKeywords = uniteSets(
	basicKeywords,
	listStyleTypeKeywords,
	listStylePositionKeywords,
	listStyleImageKeywords,
);

export const camelCaseKeywords = new Set([
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

export const keyframeSelectorKeywords = new Set(['from', 'to']);

// https://drafts.csswg.org/scroll-animations-1/#view-progress-timelines
export const namedTimelineRangeKeywords = new Set([
	'contain',
	'cover',
	'entry',
	'entry-crossing',
	'exit',
	'exit-crossing',
]);

export const systemColorsKeywords = new Set([
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

export const namedColorsKeywords = new Set([
	// https://www.w3.org/TR/css-color-4/#named-colors
	'aliceblue',
	'antiquewhite',
	'aqua',
	'aquamarine',
	'azure',
	'beige',
	'bisque',
	'black',
	'blanchedalmond',
	'blue',
	'blueviolet',
	'brown',
	'burlywood',
	'cadetblue',
	'chartreuse',
	'chocolate',
	'coral',
	'cornflowerblue',
	'cornsilk',
	'crimson',
	'cyan',
	'darkblue',
	'darkcyan',
	'darkgoldenrod',
	'darkgray',
	'darkgreen',
	'darkgrey',
	'darkkhaki',
	'darkmagenta',
	'darkolivegreen',
	'darkorange',
	'darkorchid',
	'darkred',
	'darksalmon',
	'darkseagreen',
	'darkslateblue',
	'darkslategray',
	'darkslategrey',
	'darkturquoise',
	'darkviolet',
	'deeppink',
	'deepskyblue',
	'dimgray',
	'dimgrey',
	'dodgerblue',
	'firebrick',
	'floralwhite',
	'forestgreen',
	'fuchsia',
	'gainsboro',
	'ghostwhite',
	'gold',
	'goldenrod',
	'gray',
	'green',
	'greenyellow',
	'grey',
	'honeydew',
	'hotpink',
	'indianred',
	'indigo',
	'ivory',
	'khaki',
	'lavender',
	'lavenderblush',
	'lawngreen',
	'lemonchiffon',
	'lightblue',
	'lightcoral',
	'lightcyan',
	'lightgoldenrodyellow',
	'lightgray',
	'lightgreen',
	'lightgrey',
	'lightpink',
	'lightsalmon',
	'lightseagreen',
	'lightskyblue',
	'lightslategray',
	'lightslategrey',
	'lightsteelblue',
	'lightyellow',
	'lime',
	'limegreen',
	'linen',
	'magenta',
	'maroon',
	'mediumaquamarine',
	'mediumblue',
	'mediumorchid',
	'mediumpurple',
	'mediumseagreen',
	'mediumslateblue',
	'mediumspringgreen',
	'mediumturquoise',
	'mediumvioletred',
	'midnightblue',
	'mintcream',
	'mistyrose',
	'moccasin',
	'navajowhite',
	'navy',
	'oldlace',
	'olive',
	'olivedrab',
	'orange',
	'orangered',
	'orchid',
	'palegoldenrod',
	'palegreen',
	'paleturquoise',
	'palevioletred',
	'papayawhip',
	'peachpuff',
	'peru',
	'pink',
	'plum',
	'powderblue',
	'purple',
	'rebeccapurple',
	'red',
	'rosybrown',
	'royalblue',
	'saddlebrown',
	'salmon',
	'sandybrown',
	'seagreen',
	'seashell',
	'sienna',
	'silver',
	'skyblue',
	'slateblue',
	'slategray',
	'slategrey',
	'snow',
	'springgreen',
	'steelblue',
	'tan',
	'teal',
	'thistle',
	'tomato',
	'turquoise',
	'violet',
	'wheat',
	'white',
	'whitesmoke',
	'yellow',
	'yellowgreen',
]);
