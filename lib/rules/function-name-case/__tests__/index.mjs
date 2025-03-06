import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['lower'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { margin: calc(5% - 10em); }',
		},
		{
			code: 'a { margin: calc(5%/*comment*/ - 10em); }',
			description: 'Correct comments parsing',
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
		},
		{
			code: '$map: (key: value,key2: value2)',
			description: 'Sass map ignored',
		},
		{
			code: '$map: (Key: Value, Key2: Value2)',
			description: 'Sass map ignored',
		},
		{
			code: '$list: (value, value2)',
			description: 'Sass list ignored',
		},
		{
			code: '$list: (Value, Value2)',
			description: 'Sass list ignored',
		},
		{
			code: 'a::before { content: attr(data-foo\n); }',
		},
		{
			code: 'a { padding: calc(1px * 2) calc(1px * 2); }',
		},
		{
			code: 'a { padding: some-function(5px); }',
		},
		{
			code: 'a { background: -webkit-radial-gradient(red, green, blue); }',
		},
		{
			code: '@media (max-width: 10px) { a { color: color(rgb(0, 0, 0) lightness(50%)); } }',
		},
		{
			code: 'a { transform: translateX(0); }',
		},
		{
			code: 'a { transform: scaleX(0); }',
		},
		{
			code: 'a { transform: rotateX(0); }',
		},
		{
			code: 'a { transform: skewX(0); }',
		},
	],

	reject: [
		{
			code: 'a { margin: Calc(5% - 10em); }',
			fixed: 'a { margin: calc(5% - 10em); }',
			fix: {
				range: [12, 13],
				text: 'c',
			},
			message: messages.expected('Calc', 'calc'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { margin: Calc(5%/*comment*/ - 10em); }',
			fixed: 'a { margin: calc(5%/*comment*/ - 10em); }',
			fix: {
				range: [12, 13],
				text: 'c',
			},
			message: messages.expected('Calc', 'calc'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: cAlC(5% - 10em); }',
			fixed: 'a { margin: calc(5% - 10em); }',
			fix: {
				range: [13, 16],
				text: 'alc',
			},
			message: messages.expected('cAlC', 'calc'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { Margin: CALC(5% - 10em); }',
			fixed: 'a { Margin: calc(5% - 10em); }',
			fix: {
				range: [12, 16],
				text: 'calc',
			},
			message: messages.expected('CALC', 'calc'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { background-image: linear-gradient(to right, white Calc(100% - 50em), silver); }',
			fixed: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
			fix: {
				range: [54, 55],
				text: 'c',
			},
			message: messages.expected('Calc', 'calc'),
			line: 1,
			column: 55,
		},
		{
			code: 'a { background-image: linear-gradient(to right, white cAlC(100% - 50em), silver); }',
			fixed: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
			fix: {
				range: [55, 58],
				text: 'alc',
			},
			message: messages.expected('cAlC', 'calc'),
			line: 1,
			column: 55,
		},
		{
			code: 'a { background-image: linear-gradient(to right, white CALC(100% - 50em), silver); }',
			fixed: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
			fix: {
				range: [54, 58],
				text: 'calc',
			},
			message: messages.expected('CALC', 'calc'),
			line: 1,
			column: 55,
		},
		{
			code: 'a::before { content: Attr(data-foo\n); }',
			fixed: 'a::before { content: attr(data-foo\n); }',
			fix: {
				range: [21, 22],
				text: 'a',
			},
			message: messages.expected('Attr', 'attr'),
			line: 1,
			column: 22,
		},
		{
			code: 'a::before { content: aTtR(data-foo\n); }',
			fixed: 'a::before { content: attr(data-foo\n); }',
			fix: {
				range: [22, 25],
				text: 'ttr',
			},
			message: messages.expected('aTtR', 'attr'),
			line: 1,
			column: 22,
		},
		{
			code: 'a::before { content: ATTR(data-foo\n); }',
			fixed: 'a::before { content: attr(data-foo\n); }',
			fix: {
				range: [21, 25],
				text: 'attr',
			},
			message: messages.expected('ATTR', 'attr'),
			line: 1,
			column: 22,
		},
		{
			code: 'a { padding: Calc(1px * 2) calc(1px * 2); }',
			fixed: 'a { padding: calc(1px * 2) calc(1px * 2); }',
			fix: {
				range: [13, 14],
				text: 'c',
			},
			message: messages.expected('Calc', 'calc'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { padding: calc(1px * 2) Calc(1px * 2); }',
			fixed: 'a { padding: calc(1px * 2) calc(1px * 2); }',
			fix: {
				range: [27, 28],
				text: 'c',
			},
			message: messages.expected('Calc', 'calc'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { padding: Some-function(5px); }',
			fixed: 'a { padding: some-function(5px); }',
			fix: {
				range: [13, 14],
				text: 's',
			},
			message: messages.expected('Some-function', 'some-function'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { padding: some-Function(5px); }',
			fixed: 'a { padding: some-function(5px); }',
			fix: {
				range: [18, 19],
				text: 'f',
			},
			message: messages.expected('some-Function', 'some-function'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { padding: SOME-FUNCTION(5px); }',
			fixed: 'a { padding: some-function(5px); }',
			fix: {
				range: [13, 26],
				text: 'some-function',
			},
			message: messages.expected('SOME-FUNCTION', 'some-function'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { background: -WEBKIT-radial-gradient(red, green, blue); }',
			fixed: 'a { background: -webkit-radial-gradient(red, green, blue); }',
			fix: {
				range: [17, 23],
				text: 'webkit',
			},
			message: messages.expected('-WEBKIT-radial-gradient', '-webkit-radial-gradient'),
			line: 1,
			column: 17,
		},
		{
			code: '@media (max-width: 10px) { a { color: Color(rgb(0, 0, 0) lightness(50%)); } }',
			fixed: '@media (max-width: 10px) { a { color: color(rgb(0, 0, 0) lightness(50%)); } }',
			fix: {
				range: [38, 39],
				text: 'c',
			},
			message: messages.expected('Color', 'color'),
			line: 1,
			column: 39,
		},
		{
			code: '@media (max-width: 10px) { a { color: color(Rgb(0, 0, 0) lightness(50%)); } }',
			fixed: '@media (max-width: 10px) { a { color: color(rgb(0, 0, 0) lightness(50%)); } }',
			fix: {
				range: [44, 45],
				text: 'r',
			},
			message: messages.expected('Rgb', 'rgb'),
			line: 1,
			column: 45,
		},
		{
			code: '@media (max-width: 10px) { a { color: color(rgb(0, 0, 0) Lightness(50%)); } }',
			fixed: '@media (max-width: 10px) { a { color: color(rgb(0, 0, 0) lightness(50%)); } }',
			fix: {
				range: [57, 58],
				text: 'l',
			},
			message: messages.expected('Lightness', 'lightness'),
			line: 1,
			column: 58,
		},
		{
			code: 'a { transform: TranslateX(0); }',
			fixed: 'a { transform: translateX(0); }',
			fix: {
				range: [15, 16],
				text: 't',
			},
			message: messages.expected('TranslateX', 'translateX'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: tRaNsLaTeX(0); }',
			fixed: 'a { transform: translateX(0); }',
			fix: {
				range: [16, 23],
				text: 'ranslat',
			},
			message: messages.expected('tRaNsLaTeX', 'translateX'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: TRANSLATEX(0); }',
			fixed: 'a { transform: translateX(0); }',
			fix: {
				range: [15, 24],
				text: 'translate',
			},
			message: messages.expected('TRANSLATEX', 'translateX'),
			line: 1,
			column: 16,
		},
	],
});

testRule({
	ruleName,
	config: ['lower', { ignoreFunctions: ['someFunction', '/^get.*$/'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: somefunction(); }',
			description: "Accepted because primary option is 'lower'",
		},
		{
			code: 'a { color: someFunction(); }',
			description: 'Accepted because exact case-sensitive string is ignored',
		},
		{
			code: 'a { color: getDefaultColor(); }',
		},
		{
			code: 'a { color: get_default_color(); }',
		},
	],

	reject: [
		{
			code: 'a { color: OTHER-SOME-FUNCTION(); }',
			fixed: 'a { color: other-some-function(); }',
			fix: {
				range: [11, 30],
				text: 'other-some-function',
			},
			message: messages.expected('OTHER-SOME-FUNCTION', 'other-some-function'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: SoMeFuNcTiOn(); }',
			fixed: 'a { color: somefunction(); }',
			fix: {
				range: [11, 22],
				text: 'somefunctio',
			},
			message: messages.expected('SoMeFuNcTiOn', 'somefunction'),
			line: 1,
			column: 12,
			description: "Rejected because doesn't match exact case-sensitive string that is ignored",
		},
		{
			code: 'a { color: SOMEFUNCTION(); }',
			fixed: 'a { color: somefunction(); }',
			fix: {
				range: [11, 23],
				text: 'somefunction',
			},
			message: messages.expected('SOMEFUNCTION', 'somefunction'),
			line: 1,
			column: 12,
			description: "Rejected because doesn't match exact case-sensitive string that is ignored",
		},
		{
			code: 'a { color: GetColor(); }',
			fixed: 'a { color: getcolor(); }',
			fix: {
				range: [11, 15],
				text: 'getc',
			},
			message: messages.expected('GetColor', 'getcolor'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: Get_COLOR(); }',
			fixed: 'a { color: get_color(); }',
			fix: {
				range: [11, 20],
				text: 'get_color',
			},
			message: messages.expected('Get_COLOR', 'get_color'),
			line: 1,
			column: 12,
		},
	],
});

testRule({
	ruleName,
	config: ['lower', { ignoreFunctions: [/someFunction/] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: someFunction(); }',
			description: 'Accepted because exact case-sensitive string is ignored',
		},
	],

	reject: [
		{
			code: 'a { color: SoMeFuNcTiOn(); }',
			fixed: 'a { color: somefunction(); }',
			fix: {
				range: [11, 22],
				text: 'somefunctio',
			},
			message: messages.expected('SoMeFuNcTiOn', 'somefunction'),
			line: 1,
			column: 12,
			description: "Rejected because doesn't match exact case-sensitive string that is ignored",
		},
		{
			code: 'a { color: SOMEFUNCTION(); }',
			fixed: 'a { color: somefunction(); }',
			fix: {
				range: [11, 23],
				text: 'somefunction',
			},
			message: messages.expected('SOMEFUNCTION', 'somefunction'),
			line: 1,
			column: 12,
			description: "Rejected because doesn't match exact case-sensitive string that is ignored",
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { margin: CALC(5% - 10em); }',
		},
		{
			code: 'a { margin: CALC(5%/*comment*/ - 10em); }',
			description: 'Correct comments parsing',
		},
		{
			code: 'a { background-image: LINEAR-GRADIENT(to right, white CALC(100% - 50em), silver); }',
		},
		{
			code: '$map: (key: value,key2: value2)',
			description: 'Sass map ignored',
		},
		{
			code: '$map: (Key: Value, Key2: Value2)',
			description: 'Sass map ignored',
		},
		{
			code: '$list: (value, value2)',
			description: 'Sass list ignored',
		},
		{
			code: '$list: (Value, Value2)',
			description: 'Sass list ignored',
		},
		{
			code: 'a::before { content: ATTR(data-foo\n); }',
		},
		{
			code: 'a { padding: CALC(1px * 2) CALC(1px * 2); }',
		},
		{
			code: 'a { padding: SOME-FUNCTION(5px); }',
		},
		{
			code: 'a { background: -WEBKIT-RADIAL-GRADIENT(red, green, blue); }',
		},
		{
			code: '@media (max-width: 10px) { a { color: COLOR(RGB(0, 0, 0) LIGHTNESS(50%)); } }',
		},
		{
			code: 'a { transform: TRANSLATEX(0); }',
		},
	],

	reject: [
		{
			code: 'a { margin: Calc(5% - 10em); }',
			fixed: 'a { margin: CALC(5% - 10em); }',
			fix: {
				range: [13, 16],
				text: 'ALC',
			},
			message: messages.expected('Calc', 'CALC'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { margin: cAlC(5% - 10em); }',
			fixed: 'a { margin: CALC(5% - 10em); }',
			fix: {
				range: [12, 15],
				text: 'CAL',
			},
			message: messages.expected('cAlC', 'CALC'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { Margin: calc(5% - 10em); }',
			fixed: 'a { Margin: CALC(5% - 10em); }',
			fix: {
				range: [12, 16],
				text: 'CALC',
			},
			message: messages.expected('calc', 'CALC'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: CalC(5%/*comment*/ - 10em); }',
			fixed: 'a { margin: CALC(5%/*comment*/ - 10em); }',
			fix: {
				range: [13, 15],
				text: 'AL',
			},
			message: messages.expected('CalC', 'CALC'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { background-image: LINEAR-GRADIENT(to right, white Calc(100% - 50em), silver); }',
			fixed: 'a { background-image: LINEAR-GRADIENT(to right, white CALC(100% - 50em), silver); }',
			fix: {
				range: [55, 58],
				text: 'ALC',
			},
			message: messages.expected('Calc', 'CALC'),
			line: 1,
			column: 55,
		},
		{
			code: 'a { background-image: LINEAR-GRADIENT(to right, white cAlC(100% - 50em), silver); }',
			fixed: 'a { background-image: LINEAR-GRADIENT(to right, white CALC(100% - 50em), silver); }',
			fix: {
				range: [54, 57],
				text: 'CAL',
			},
			message: messages.expected('cAlC', 'CALC'),
			line: 1,
			column: 55,
		},
		{
			code: 'a { background-image: LINEAR-GRADIENT(to right, white calc(100% - 50em), silver); }',
			fixed: 'a { background-image: LINEAR-GRADIENT(to right, white CALC(100% - 50em), silver); }',
			fix: {
				range: [54, 58],
				text: 'CALC',
			},
			message: messages.expected('calc', 'CALC'),
			line: 1,
			column: 55,
		},
		{
			code: 'a::before { content: Attr(data-foo\n); }',
			fixed: 'a::before { content: ATTR(data-foo\n); }',
			fix: {
				range: [22, 25],
				text: 'TTR',
			},
			message: messages.expected('Attr', 'ATTR'),
			line: 1,
			column: 22,
		},
		{
			code: 'a::before { content: aTtR(data-foo\n); }',
			fixed: 'a::before { content: ATTR(data-foo\n); }',
			fix: {
				range: [21, 24],
				text: 'ATT',
			},
			message: messages.expected('aTtR', 'ATTR'),
			line: 1,
			column: 22,
		},
		{
			code: 'a::before { content: attr(data-foo\n); }',
			fixed: 'a::before { content: ATTR(data-foo\n); }',
			fix: {
				range: [21, 25],
				text: 'ATTR',
			},
			message: messages.expected('attr', 'ATTR'),
			line: 1,
			column: 22,
		},
		{
			code: 'a { padding: Calc(1px * 2) CALC(1px * 2); }',
			fixed: 'a { padding: CALC(1px * 2) CALC(1px * 2); }',
			fix: {
				range: [14, 17],
				text: 'ALC',
			},
			message: messages.expected('Calc', 'CALC'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { padding: CALC(1px * 2) Calc(1px * 2); }',
			fixed: 'a { padding: CALC(1px * 2) CALC(1px * 2); }',
			fix: {
				range: [28, 31],
				text: 'ALC',
			},
			message: messages.expected('Calc', 'CALC'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { padding: Some-function(5px); }',
			fixed: 'a { padding: SOME-FUNCTION(5px); }',
			fix: {
				range: [14, 26],
				text: 'OME-FUNCTION',
			},
			message: messages.expected('Some-function', 'SOME-FUNCTION'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { padding: some-Function(5px); }',
			fixed: 'a { padding: SOME-FUNCTION(5px); }',
			fix: {
				range: [13, 26],
				text: 'SOME-FUNCTION',
			},
			message: messages.expected('some-Function', 'SOME-FUNCTION'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { padding: some-function(5px); }',
			fixed: 'a { padding: SOME-FUNCTION(5px); }',
			fix: {
				range: [13, 26],
				text: 'SOME-FUNCTION',
			},
			message: messages.expected('some-function', 'SOME-FUNCTION'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { background: -WEBKIT-radial-gradient(red, green, blue); }',
			fixed: 'a { background: -WEBKIT-RADIAL-GRADIENT(red, green, blue); }',
			fix: {
				range: [24, 39],
				text: 'RADIAL-GRADIENT',
			},
			message: messages.expected('-WEBKIT-radial-gradient', '-WEBKIT-RADIAL-GRADIENT'),
			line: 1,
			column: 17,
		},
		{
			code: '@media (max-width: 10px) { a { color: Color(RGB(0, 0, 0) LIGHTNESS(50%)); } }',
			fixed: '@media (max-width: 10px) { a { color: COLOR(RGB(0, 0, 0) LIGHTNESS(50%)); } }',
			fix: {
				range: [39, 43],
				text: 'OLOR',
			},
			message: messages.expected('Color', 'COLOR'),
			line: 1,
			column: 39,
		},
		{
			code: '@media (max-width: 10px) { a { color: COLOR(Rgb(0, 0, 0) LIGHTNESS(50%)); } }',
			fixed: '@media (max-width: 10px) { a { color: COLOR(RGB(0, 0, 0) LIGHTNESS(50%)); } }',
			fix: {
				range: [45, 47],
				text: 'GB',
			},
			message: messages.expected('Rgb', 'RGB'),
			line: 1,
			column: 45,
		},
		{
			code: '@media (max-width: 10px) { a { color: COLOR(RGB(0, 0, 0) Lightness(50%)); } }',
			fixed: '@media (max-width: 10px) { a { color: COLOR(RGB(0, 0, 0) LIGHTNESS(50%)); } }',
			fix: {
				range: [58, 66],
				text: 'IGHTNESS',
			},
			message: messages.expected('Lightness', 'LIGHTNESS'),
			line: 1,
			column: 58,
		},
		{
			code: 'a { transform: TranslateX(0); }',
			fixed: 'a { transform: TRANSLATEX(0); }',
			fix: {
				range: [16, 24],
				text: 'RANSLATE',
			},
			message: messages.expected('TranslateX', 'TRANSLATEX'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: tRaNsLaTeX(0); }',
			fixed: 'a { transform: TRANSLATEX(0); }',
			fix: {
				range: [15, 24],
				text: 'TRANSLATE',
			},
			message: messages.expected('tRaNsLaTeX', 'TRANSLATEX'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: translateX(0); }',
			fixed: 'a { transform: TRANSLATEX(0); }',
			fix: {
				range: [15, 24],
				text: 'TRANSLATE',
			},
			message: messages.expected('translateX', 'TRANSLATEX'),
			line: 1,
			column: 16,
		},
	],
});

testRule({
	ruleName,
	config: [
		'upper',
		{
			ignoreFunctions: ['Some-function', 'sOmE-FuNcTiOn', 'some-function', '/^get.*$/'],
		},
	],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: Some-function(); }',
		},
		{
			code: 'a { color: sOmE-FuNcTiOn(); }',
		},
		{
			code: 'a { color: SOME-FUNCTION(); }',
		},
		{
			code: 'a { color: some-function(); }',
		},
		{
			code: 'a { color: getDefaultColor(); }',
		},
		{
			code: 'a { color: get_default_color(); }',
		},
	],

	reject: [
		{
			code: 'a { color: other-some-function(); }',
			fixed: 'a { color: OTHER-SOME-FUNCTION(); }',
			fix: {
				range: [11, 30],
				text: 'OTHER-SOME-FUNCTION',
			},
			message: messages.expected('other-some-function', 'OTHER-SOME-FUNCTION'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: SoMe-FuNcTiOn(); }',
			fixed: 'a { color: SOME-FUNCTION(); }',
			fix: {
				range: [12, 24],
				text: 'OME-FUNCTION',
			},
			message: messages.expected('SoMe-FuNcTiOn', 'SOME-FUNCTION'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: GetColor(); }',
			fixed: 'a { color: GETCOLOR(); }',
			fix: {
				range: [12, 19],
				text: 'ETCOLOR',
			},
			message: messages.expected('GetColor', 'GETCOLOR'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: Get_COLOR(); }',
			fixed: 'a { color: GET_COLOR(); }',
			fix: {
				range: [12, 14],
				text: 'ET',
			},
			message: messages.expected('Get_COLOR', 'GET_COLOR'),
			line: 1,
			column: 12,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['upper'],
	fix: true,

	accept: [
		{
			code: 'a { margin: cAlC(5% - #{$size2}); }',
		},
	],
});
