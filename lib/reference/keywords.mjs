/** @type {ReadonlySet<string>} */
export const basicKeywords = new Set(['initial', 'inherit', 'revert', 'revert-layer', 'unset']);

/** @type {ReadonlySet<string>} */
export const displayOutsideKeywords = new Set(['block', 'inline', 'run-in']);

/** @type {ReadonlySet<string>} */
export const displayInsideKeywords = new Set([
	'flow',
	'flow-root',
	'table',
	'flex',
	'grid',
	'ruby',
]);

/** @type {ReadonlySet<string>} */
export const displayLegacyKeywords = new Set([
	'inline-block',
	'inline-table',
	'inline-flex',
	'inline-grid',
]);

/** @type {ReadonlySet<string>} */
export const displayListItemKeyword = new Set(['list-item']);

/** @type {ReadonlySet<string>} */
export const systemFontKeywords = basicKeywords.union(
	new Set([
		// alphabetically
		'caption',
		'icon',
		'menu',
		'message-box',
		'small-caption',
		'status-bar',
	]),
);

/** @type {ReadonlySet<string>} */
export const fontFamilyKeywords = basicKeywords.union(
	new Set([
		// alphabetically
		'cursive',
		'emoji',
		'fangsong',
		'fantasy',
		'math',
		'monospace',
		'sans-serif',
		'serif',
		'system-ui',
		'ui-monospace',
		'ui-rounded',
		'ui-sans-serif',
		'ui-serif',
	]),
);

/** @type {ReadonlySet<string>} */
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

/** @type {ReadonlySet<string>} */
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

/** @type {ReadonlySet<string>} */
const webkitSystemFonts = new Set([
	'-webkit-body',
	'-webkit-control',
	'-webkit-mini-control',
	'-webkit-pictograph',
	'-webkit-small-control',
	'-webkit-standard',
]);

/** @type {ReadonlySet<string>} */
export const prefixedSystemFonts = appleSystemFonts
	.union(mozillaSystemFonts)
	.union(webkitSystemFonts);

/** @type {ReadonlySet<string>} */
export const fontWeightRelativeKeywords = new Set(['bolder', 'lighter']);

/** @type {ReadonlySet<string>} */
export const fontWeightAbsoluteKeywords = new Set(['normal', 'bold']);

/** @type {ReadonlySet<string>} */
export const fontWeightNonNumericKeywords = fontWeightRelativeKeywords.union(
	fontWeightAbsoluteKeywords,
);

/** @type {ReadonlySet<string>} */
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

/** @type {ReadonlySet<string>} */
export const fontWeightNumericKeywordsWithNamedEquivalent = new Set(['400', '700']);

/** @type {ReadonlySet<string>} */
export const fontWeightKeywords = basicKeywords
	.union(fontWeightNonNumericKeywords)
	.union(fontWeightNumericKeywords);

/** @type {ReadonlySet<string>} */
const fontStyleKeywords = basicKeywords.union(new Set(['normal', 'italic', 'oblique']));

/** @type {ReadonlySet<string>} */
const fontVariantCSS2Keywords = basicKeywords.union(new Set(['normal', 'none', 'small-caps']));

/** @type {ReadonlySet<string>} */
const fontStretchKeywords = basicKeywords.union(
	new Set([
		// alphabetically
		'condensed',
		'expanded',
		'extra-condensed',
		'extra-expanded',
		'semi-condensed',
		'semi-expanded',
		'ultra-condensed',
		'ultra-expanded',
	]),
);

/** @type {ReadonlySet<string>} */
export const fontSizeKeywords = basicKeywords.union(
	new Set([
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
		'-konq-xxx-large',
		'-webkit-xxx-large',
	]),
);

/** @type {ReadonlySet<string>} */
const lineHeightKeywords = basicKeywords.union(new Set(['normal']));

/** @type {ReadonlySet<string>} */
export const fontShorthandKeywords = basicKeywords
	.union(fontStyleKeywords)
	.union(fontVariantCSS2Keywords)
	.union(fontWeightKeywords)
	.union(fontStretchKeywords)
	.union(fontSizeKeywords)
	.union(lineHeightKeywords)
	.union(fontFamilyKeywords);

/** @type {ReadonlySet<string>} */
export const animationNameKeywords = basicKeywords.union(new Set(['none']));

/** @type {ReadonlySet<string>} */
const animationTimingFunctionKeywords = basicKeywords.union(
	new Set([
		// alphabetically
		'cubic-bezier',
		'ease',
		'ease-in',
		'ease-in-out',
		'ease-out',
		'linear',
		'step-end',
		'step-start',
		'steps',
	]),
);

/** @type {ReadonlySet<string>} */
const animationIterationCountKeywords = new Set(['infinite']);

/** @type {ReadonlySet<string>} */
const animationDirectionKeywords = basicKeywords.union(
	new Set([
		// alphabetically
		'alternate',
		'alternate-reverse',
		'normal',
		'reverse',
	]),
);

/** @type {ReadonlySet<string>} */
const animationFillModeKeywords = new Set(['none', 'forwards', 'backwards', 'both']);

/** @type {ReadonlySet<string>} */
const animationPlayStateKeywords = basicKeywords.union(new Set(['running', 'paused']));

/**
 * @see https://developer.mozilla.org/docs/Web/CSS/animation
 * @type {ReadonlySet<string>}
 */
export const animationShorthandKeywords = basicKeywords
	.union(animationNameKeywords)
	.union(animationTimingFunctionKeywords)
	.union(animationIterationCountKeywords)
	.union(animationDirectionKeywords)
	.union(animationFillModeKeywords)
	.union(animationPlayStateKeywords);

/** @type {ReadonlySet<string>} */
export const gridRowKeywords = basicKeywords.union(new Set(['auto', 'span']));

/** @type {ReadonlySet<string>} */
export const gridColumnKeywords = basicKeywords.union(new Set(['auto', 'span']));

/** @type {ReadonlySet<string>} */
export const gridAreaKeywords = basicKeywords.union(new Set(['auto', 'span']));

/**
 * @see https://developer.mozilla.org/docs/Web/CSS/counter-increment
 * @type {ReadonlySet<string>}
 */
export const counterIncrementKeywords = basicKeywords.union(new Set(['none']));

/** @type {ReadonlySet<string>} */
export const counterResetKeywords = basicKeywords.union(new Set(['none']));

/**
 * @see https://developer.mozilla.org/docs/Web/CSS/list-style-type
 * @type {ReadonlySet<string>}
 */
export const listStyleTypeKeywords = basicKeywords.union(
	new Set([
		// alphabetically
		'afar',
		'amharic',
		'amharic-abegede',
		'arabic-indic',
		'armenian',
		'asterisks',
		'bengali',
		'binary',
		'cambodian',
		'circle',
		'cjk-decimal',
		'cjk-earthly-branch',
		'cjk-heavenly-stem',
		'cjk-ideographic',
		'decimal',
		'decimal-leading-zero',
		'devanagari',
		'disc',
		'disclosure-closed',
		'disclosure-open',
		'ethiopic-abegede',
		'ethiopic-abegede-am-et',
		'ethiopic-abegede-gez',
		'ethiopic-abegede-ti-er',
		'ethiopic-abegede-ti-et',
		'ethiopic-halehame',
		'ethiopic-halehame-aa-er',
		'ethiopic-halehame-aa-et',
		'ethiopic-halehame-am',
		'ethiopic-halehame-am-et',
		'ethiopic-halehame-gez',
		'ethiopic-halehame-om-et',
		'ethiopic-halehame-sid-et',
		'ethiopic-halehame-so-et',
		'ethiopic-halehame-ti-er',
		'ethiopic-halehame-ti-et',
		'ethiopic-halehame-tig',
		'ethiopic-numeric',
		'footnotes',
		'georgian',
		'gujarati',
		'gurmukhi',
		'hangul',
		'hangul-consonant',
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
		'lower-alpha',
		'lower-armenian',
		'lower-greek',
		'lower-hexadecimal',
		'lower-latin',
		'lower-norwegian',
		'lower-roman',
		'malayalam',
		'mongolian',
		'myanmar',
		'none',
		'octal',
		'oriya',
		'oromo',
		'persian',
		'sidama',
		'simp-chinese-formal',
		'simp-chinese-informal',
		'somali',
		'square',
		'tamil',
		'telugu',
		'thai',
		'tibetan',
		'tigre',
		'tigrinya-er',
		'tigrinya-er-abegede',
		'tigrinya-et',
		'tigrinya-et-abegede',
		'trad-chinese-formal',
		'trad-chinese-informal',
		'upper-alpha',
		'upper-armenian',
		'upper-greek',
		'upper-hexadecimal',
		'upper-latin',
		'upper-norwegian',
		'upper-roman',
		'urdu',
	]),
);

/** @type {ReadonlySet<string>} */
export const listStylePositionKeywords = basicKeywords.union(new Set(['inside', 'outside']));

/** @type {ReadonlySet<string>} */
export const listStyleImageKeywords = basicKeywords.union(new Set(['none']));

/** @type {ReadonlySet<string>} */
export const listStyleShorthandKeywords = basicKeywords
	.union(listStyleTypeKeywords)
	.union(listStylePositionKeywords)
	.union(listStyleImageKeywords);

/** @type {ReadonlySet<string>} */
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

/** @type {ReadonlySet<string>} */
export const keyframeSelectorKeywords = new Set(['from', 'to']);

/**
 * @see https://drafts.csswg.org/scroll-animations-1/#view-progress-timelines
 * @type {ReadonlySet<string>}
 */
export const namedTimelineRangeKeywords = new Set([
	'contain',
	'cover',
	'entry',
	'entry-crossing',
	'exit',
	'exit-crossing',
]);

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Mozilla_Extensions#color_keywords
 * @type {ReadonlySet<string>}
 */
const prefixedSystemColorKeywords = new Set([
	'-moz-buttondefault',
	'-moz-buttonhoverface',
	'-moz-buttonhovertext',
	'-moz-cellhighlight',
	'-moz-cellhighlighttext',
	'-moz-combobox',
	'-moz-comboboxtext',
	'-moz-dialog',
	'-moz-dialogtext',
	'-moz-dragtargetzone',
	'-moz-eventreerow',
	'-moz-field',
	'-moz-fieldtext',
	'-moz-html-cellhighlight',
	'-moz-html-cellhighlighttext',
	'-moz-mac-accentdarkestshadow',
	'-moz-mac-accentdarkshadow',
	'-moz-mac-accentface',
	'-moz-mac-accentlightesthighlight',
	'-moz-mac-accentlightshadow',
	'-moz-mac-accentregularhighlight',
	'-moz-mac-accentregularshadow',
	'-moz-mac-chrome-active',
	'-moz-mac-chrome-inactive',
	'-moz-mac-focusring',
	'-moz-mac-menuselect',
	'-moz-mac-menushadow',
	'-moz-mac-menutextselect',
	'-moz-menubarhovertext',
	'-moz-menubartext',
	'-moz-menuhover',
	'-moz-menuhovertext',
	'-moz-nativehyperlinktext',
	'-moz-oddtreerow',
	'-moz-win-accentcolor',
	'-moz-win-accentcolortext',
	'-moz-win-communicationstext',
	'-moz-win-mediatext',
	'-ms-hotlight',
]);

/** @type {ReadonlySet<string>} */
export const deprecatedSystemColorKeywords = new Set([
	'activeborder',
	'activecaption',
	'appworkspace',
	'background',
	'buttonhighlight',
	'buttonshadow',
	'captiontext',
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

/**
 * @see https://www.w3.org/TR/css-color-4/#css-system-colors
 * @type {ReadonlySet<string>}
 */
export const systemColorsKeywords = prefixedSystemColorKeywords
	.union(deprecatedSystemColorKeywords)
	.union(
		new Set([
			// alphabetically
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
		]),
	);

/**
 * @see https://www.w3.org/TR/css-color-4/#named-colors
 * @type {ReadonlySet<string>}
 */
export const namedColorsKeywords = new Set([
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

/** @type {ReadonlyMap<string, ReadonlyMap<string, string>>} */
export const physicalToFlowRelativeValueKeywordsByProperty = new Map([
	[
		'clear',
		new Map([
			['left', 'inline-start'],
			['right', 'inline-end'],
		]),
	],
	[
		'float',
		new Map([
			['left', 'inline-start'],
			['right', 'inline-end'],
		]),
	],
	[
		'offset-anchor',
		new Map([
			['top', 'block-start'],
			['bottom', 'block-end'],
			['left', 'inline-start'],
			['right', 'inline-end'],
		]),
	],
	[
		'offset-position',
		new Map([
			['top', 'block-start'],
			['bottom', 'block-end'],
			['left', 'inline-start'],
			['right', 'inline-end'],
		]),
	],
	[
		'resize',
		new Map([
			['horizontal', 'inline'],
			['vertical', 'block'],
		]),
	],
	[
		'text-align',
		new Map([
			['left', 'start'],
			['right', 'end'],
		]),
	],
	[
		'text-align-last',
		new Map([
			['left', 'start'],
			['right', 'end'],
		]),
	],
]);

/** @type {ReadonlyMap<string, ReadonlySet<string>>} */
export const flowRelativeValueKeywordsByProperty = new Map(
	[...physicalToFlowRelativeValueKeywordsByProperty].map(([property, mapping]) => [
		property,
		new Set(mapping.values()),
	]),
);
