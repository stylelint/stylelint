import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: ['px', 'vmin', 'f'],

	accept: [
		{
			code: 'a { line-height: 1; }',
		},
		{
			code: 'a { color: #000; }',
		},
		{
			code: 'a { top: 0; left: 0; }',
		},
		{
			code: 'a { font-size: 100%; }',
		},
		{
			code: 'a { line-height: 1.2rem; }',
		},
		{
			code: 'a { line-height: 1.2rEm; }',
		},
		{
			code: 'a { line-height: 1.2REM; }',
		},
		{
			code: 'a { font-size: .5rem; }',
		},
		{
			code: 'a { font-size: 0.5rem; }',
		},
		{
			code: 'a { margin: 0 10em 5rem 2in; }',
		},
		{
			code: 'a { background-position: top right, 1em 5vh; }',
		},
		{
			code: 'a { top: calc(10em - 3em); }',
		},
		{
			code: 'a { top: calc(10em*2rem); }',
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
		},
		{
			code: 'a { width: /* 100px */ 1em; }',
			description: 'ignore unit within comments',
		},
		{
			code: 'a::before { content: "10px"}',
			description: 'ignore unit within quotes',
		},
		{
			code: 'a { font-size: $fs10px; }',
			description: 'ignore preprocessor variable includes unit',
		},
		{
			code: 'a { font-size: --some-fs-10px; }',
			description: 'ignore css variable includes unit',
		},
		{
			code: 'a { background-url: url(10vmin); }',
			description: 'ignore url function',
		},
		{
			code: 'a { background-url: uRl(10vmin); }',
			description: 'ignore url function',
		},
		{
			code: 'a { background-url: URL(10vmin); }',
			description: 'ignore url function',
		},
		{
			code: 'a { margin10px: 10em; }',
			description: 'ignore property include wrong unit',
		},
		{
			code: 'a10px { margin: 10em; }',
			description: 'ignore type selector include wrong unit',
		},
		{
			code: '#a10px { margin: 10em; }',
			description: 'ignore class selector include wrong unit',
		},
		{
			code: '.a10px { margin: 10em; }',
			description: 'ignore class selector include wrong unit',
		},
		{
			code: 'input[type=10px] { margin: 10em; }',
			description: 'ignore class selector include wrong unit',
		},
		{
			code: 'a:hover10px { margin: 10em; }',
			description: 'ignore pseudo-class include wrong unit',
		},
		{
			code: 'a::before10px { margin: 10em; }',
			description: 'ignore pseudo-class include wrong unit',
		},
		{
			code: 'a { margin: calc(100% - #{margin * 2}); }',
			description: 'work with interpolation',
		},
		{
			code: '@media (min-width: 10em) {}',
			description: '@media',
		},
		{
			code: '@media (min-width: 10em)\n  and (max-width: 20em) {}',
			description: 'complex @media',
		},
		{
			code: '@font-face { unicode-range: U+0100-024F; }',
		},
	],

	reject: [
		{
			code: 'a { font-size: 13px; }',
			message: messages.rejected('px'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { font-size: 13pX; }',
			message: messages.rejected('pX'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { font-size: 13PX; }',
			message: messages.rejected('PX'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { width: 100vmin; }',
			message: messages.rejected('vmin'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { line-height: .1px; }',
			message: messages.rejected('px'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { line-height: 0.1px; }',
			message: messages.rejected('px'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { border-left: 1px solid #ccc; }',
			message: messages.rejected('px'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { margin: 0 20px; }',
			message: messages.rejected('px'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { margin: 0 0 0 20px; }',
			message: messages.rejected('px'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { background-position: top right, 1em 5px; }',
			message: messages.rejected('px'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 44,
		},
		{
			code: 'a { top: calc(100px - 30vh); }',
			message: messages.rejected('px'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { top: calc(100px*2); }',
			message: messages.rejected('px'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100vh - 5vmin), silver); }',
			message: messages.rejected('vmin'),
			line: 1,
			column: 69,
			endLine: 1,
			endColumn: 73,
		},
		{
			code: 'a { margin: calc(100% - #{$margin * 2px}); }',
			message: messages.rejected('px'),
			line: 1,
			column: 38,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: '@media (min-width: 13px) {}',
			message: messages.rejected('px'),
			description: '@media',
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@media (min-width: 10em)\n  and (max-width: 20px) {}',
			message: messages.rejected('px'),
			description: 'complex @media',
			line: 2,
			column: 21,
			endLine: 2,
			endColumn: 23,
		},
		{
			code: '@media (width < 10.01px) {}',
			message: messages.rejected('px'),
			description: 'media feature range',
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@font-face { color: U+0100-024F; }',
			message: messages.rejected('F'),
			description: 'Unicode range value in something other than `unicode-range`',
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { unicode-range: U+0100-024F; }',
			message: messages.rejected('F'),
			description: 'Unicode range value in something other than `@font-face`',
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 31,
		},
	],
});

testRule({
	ruleName,

	config: 'px',

	accept: [
		{
			code: 'a { line-height: 1em; }',
		},
	],

	reject: [
		{
			code: 'a { line-height: 1px; }',
			message: messages.rejected('px'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 21,
		},
	],
});

testRule({
	ruleName,

	config: [
		['px', 'vmin'],
		{
			ignoreProperties: {
				px: ['font-size', 'margin', '/^border/'],
				vmin: ['width', 'height'],
			},
		},
	],

	accept: [
		{
			code: 'a { font-size: 13px; }',
		},
		{
			code: 'a { font-size: 13pX; }',
		},
		{
			code: 'a { margin: 0 20px; }',
		},
		{
			code: 'a { margin: 0 0 0 20Px; }',
		},
		{
			code: 'a { width: 100vmin; }',
		},
		{
			code: 'a { height: 99vmIn; }',
		},
		{
			code: 'a { border: 1px solid purple; }',
		},
		{
			code: 'a { border-bottom-width: 6px; }',
		},
	],

	reject: [
		{
			code: 'a { line-height: .1px; }',
			message: messages.rejected('px'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100vh - 5vmin), silver); }',
			message: messages.rejected('vmin'),
			line: 1,
			column: 69,
			endLine: 1,
			endColumn: 73,
		},
		{
			code: 'a { -moz-border-radius-topright: 40px; }',
			message: messages.rejected('px'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 38,
		},
	],
});

testRule({
	ruleName,

	config: [
		['px', 'vmin'],
		{
			ignoreProperties: {
				px: ['font-size', 'margin', /^border/],
				vmin: 'width',
			},
		},
	],

	accept: [
		{
			code: 'a { border: 1px solid purple; }',
		},
		{
			code: 'a { border-bottom-width: 6px; }',
		},
	],

	reject: [
		{
			code: 'a { line-height: .1px; }',
			message: messages.rejected('px'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 22,
		},
	],
});

testRule({
	ruleName,

	config: [
		['px'],
		{
			ignoreFunctions: ['calc', /^translate/],
		},
	],

	accept: [
		{
			code: 'a { margin: calc(50% - 100px) }',
		},
		{
			code: 'a { margin: min(calc(50px * 2)) }',
		},
		{
			code: 'a { margin: calc(max(50px)) }',
		},
		{
			code: 'a { transform: translate(100px, 100px) }',
		},
		{
			code: 'a { transform: translateX(100px) }',
		},
	],

	reject: [
		{
			code: 'a { margin: 100px }',
			message: messages.rejected('px'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { translate: 100px }',
			message: messages.rejected('px'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 21,
		},
	],
});

testRule({
	ruleName,

	config: [
		['px', 'dpi', '%'],
		{
			ignoreMediaFeatureNames: {
				px: ['min-width', 'height'],
				dpi: ['min-resolution', 'resolution'],
				'%': ['width', '/^min/'],
			},
		},
	],

	accept: [
		{
			code: '@media (min-width: 960px) { body { font-size: 13em } }',
		},
		{
			code: '@media (width: 960%) { /* body { font-size: 13em } */ }',
		},
		{
			code: '@media (min-width: 960%) { /* body { font-size: 13em } */ }',
		},
		{
			code: 'a { @media (min-width: 960px) { body { font-size: 13em } } }',
		},
		{
			code: '@media print and (min-resolution: 300dpi) { body { font-size: 13em } }',
		},
		{
			code: '@media print { body { font-size: 40pt } }',
		},
		{
			code: '@media screen, print { body { line-height: 1.2 } }',
		},
		{
			code: '@MEDIA (min-width: 960px) { body { font-size: 13em } }',
		},
		{
			code: '@media (MIN-WIDTH: 960px) { body { font-size: 13em } }',
		},
		{
			code: '@media (height > -100px) { body { background: green; } }',
		},
		{
			code: '@media not (resolution: -300dpi) { body { background: green; } }',
		},
		{
			code: '@media only screen and (min-width: 500px) { }',
		},
		{
			code: '@media only speech and (width > 20%) { }',
		},
		{
			code: '@media speech and (device-aspect-ratio: 16/9) { }',
		},
		{
			code: '@media only screen and (min-width: 320px) and (height: 480px) and (-webkit-min-device-pixel-ratio: 2) { body { line-height: 1.4 } }',
		},
		{
			code: '@media screen, print { }',
		},
		{
			code: '@media speech and (aspect-ratio: 11/5) { }',
		},
		{
			code: '@media (min-width: 700px), handheld and (orientation: landscape) { }',
		},
	],

	reject: [
		{
			code: '@media screen and (max-width: 500px) { }',
			message: messages.rejected('px'),
			line: 1,
			column: 34,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: '@media (width: 960px) { /* body { font-size: 13em } */ }',
			message: messages.rejected('px'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: '@media (min-height: 960px) { /* body { font-size: 13em } */ }',
			message: messages.rejected('px'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { @media screen and (max-width: 500px) { } }',
			message: messages.rejected('px'),
			line: 1,
			column: 38,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: '@media all and (min-width: 500px) and (max-width: 200px) { }',
			message: messages.rejected('px'),
			line: 1,
			column: 54,
			endLine: 1,
			endColumn: 56,
		},
		{
			code: '@MEDIA print { body { font-size: 60dpi } }',
			message: messages.rejected('dpi'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: '@media (MAX-WIDTH: 10px) { }',
			message: messages.rejected('px'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@media (min-width: 10em)\n  and (max-width: 20px) { }',
			message: messages.rejected('px'),
			line: 2,
			column: 21,
			endLine: 2,
			endColumn: 23,
		},
		{
			code: '@media (width < 10.01px) {}',
			message: messages.rejected('px'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@media only speech and (max-device-width > 20%) { }',
			message: messages.rejected('%'),
			line: 1,
			column: 46,
			endLine: 1,
			endColumn: 47,
		},
		{
			code: '@media not (max-resolution: -300dpi) { body { background: green; } }',
			message: messages.rejected('dpi'),
			line: 1,
			column: 33,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: '@media only screen and (min-width: 320px) and (height: 480px) and (-webkit-min-device-pixel-ratio: 2) { body { line-height: 1.4px } }',
			message: messages.rejected('px'),
			line: 1,
			column: 128,
			endLine: 1,
			endColumn: 130,
		},
		{
			code: '@media only screen and (min-width: 320px) and (height: 480px) and (-webkit-min-device-pixel-ratio: 2px) { body { line-height: 1.4 } }',
			message: messages.rejected('px'),
			line: 1,
			column: 101,
			endLine: 1,
			endColumn: 103,
		},
		{
			code: '@media screen and (min-width: 699px) and (min-width: 520px), (max-width: 1151px)',
			message: messages.rejected('px'),
			line: 1,
			column: 78,
			endLine: 1,
			endColumn: 80,
		},
		{
			code: 'a { color: rgb(10% 127 127) }',
			message: messages.rejected('%'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 19,
		},
	],
});

testRule({
	ruleName,

	config: [
		['px', 'dpi', '%'],
		{
			ignoreMediaFeatureNames: {
				px: ['min-width', 'height'],
				dpi: 'min-resolution',
				'%': ['width', /^min/],
			},
		},
	],

	accept: [
		{
			code: '@media (width: 960%) { /* body { font-size: 13em } */ }',
		},
		{
			code: '@media (min-width: 960%) { /* body { font-size: 13em } */ }',
		},
	],

	reject: [
		{
			code: '@media screen and (max-width: 500px) { }',
			message: messages.rejected('px'),
			line: 1,
			column: 34,
			endLine: 1,
			endColumn: 36,
		},
	],
});
