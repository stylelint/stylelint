'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { line-height: 1; }',
		},
		{
			code: 'a { color: #000; }',
		},
		{
			code: 'a { font-size: 100%; }',
		},
		{
			code: 'a { margin: 1em; }',
		},
		{
			code: 'a { margin: 1Em; }',
		},
		{
			code: 'a { margin: 1EM; }',
		},
		{
			code: 'a { margin: 1ex; }',
		},
		{
			code: 'a { margin: 1%; }',
		},
		{
			code: 'a { margin: 1px; }',
		},
		{
			code: 'a { margin: 1cm; }',
		},
		{
			code: 'a { margin: 1mm; }',
		},
		{
			code: 'a { margin: 1in; }',
		},
		{
			code: 'a { margin: 1pt; }',
		},
		{
			code: 'a { margin: 1pc; }',
		},
		{
			code: 'a { margin: 1ch; }',
		},
		{
			code: 'a { margin: 1rem; }',
		},
		{
			code: 'a { margin: 1vh; }',
		},
		{
			code: 'a { margin: 1vw; }',
		},
		{
			code: 'a { margin: 1vmin; }',
		},
		{
			code: 'a { margin: 1vmax; }',
		},
		{
			code: 'a { font-size: .5rem; }',
		},
		{
			code: 'a { font-size: 0.5rem; }',
		},
		{
			code: 'a { margin: 1vmin 1vmax; }',
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
			code: 'a { top: calc(10px*2); }',
		},
		{
			code: 'a { top: calc(10px*2%*2); }',
		},
		{
			code: 'a { top: calc(2*10px); }',
			description: 'No whitespace',
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
		},
		{
			code: 'a { transition-delay: 3s; }',
		},
		{
			code: 'a { transition-delay: 300ms; }',
		},
		{
			code: 'a { transform: rotate(90deg); }',
		},
		{
			code: 'a { transform: rotate(100grad); }',
		},
		{
			code: 'a { transform: rotate(0.25turn); }',
		},
		{
			code: 'a { transform: rotate(1.5708rad); }',
		},
		{
			code: 'a { grid-template-columns: repeat(12, 1fr); }',
		},
		{
			code: 'a { width: 1e4px }',
		},
		{
			code: 'a { width: 1E4px }',
		},
		{
			code: 'a { width: 1e10; }',
		},
		{
			code: 'a { flex: 0 9e9 auto; }',
		},
		{
			code: 'a { color: green; }',
			description: 'ignore keyword',
		},
		{
			code: 'a { color: green10pix; }',
			description: 'ignore wrong unit within keyword',
		},
		{
			code: 'a { width: /* 100pix */ 1em; }',
			description: 'ignore wrong unit within comments',
		},
		{
			code: 'a::before { content: "10pix"}',
			description: 'ignore wrong unit within quotes',
		},
		{
			code: 'a { font-size: $fs10pix; }',
			description: 'ignore preprocessor variable includes wrong unit',
		},
		{
			code: 'a { font-size: @fs10pix; }',
			description: 'ignore preprocessor variable includes wrong unit',
		},
		{
			code: 'a { font-size: var(--some-fs-10pix); }',
			description: 'ignore css variable includes wrong unit',
		},
		{
			code: 'a { margin: url(13pix); }',
			description: 'ignore url function',
		},
		{
			code: 'a { margin: uRl(13pix); }',
			description: 'ignore url function',
		},
		{
			code: 'a { margin: URL(13pix); }',
			description: 'ignore url function',
		},
		{
			code: 'a { margin10px: 10px; }',
			description: 'ignore property include wrong unit',
		},
		{
			code: 'a10pix { margin: 10px; }',
			description: 'ignore type selector include wrong unit',
		},
		{
			code: '#a10pix { margin: 10px; }',
			description: 'ignore class selector include wrong unit',
		},
		{
			code: '.a10pix { margin: 10px; }',
			description: 'ignore class selector include wrong unit',
		},
		{
			code: 'input[type=10pix] { margin: 10px; }',
			description: 'ignore class selector include wrong unit',
		},
		{
			code: 'a:hover10pix { margin: 10px; }',
			description: 'ignore pseudo-class include wrong unit',
		},
		{
			code: 'a::before10pix { margin: 10px; }',
			description: 'ignore pseudo-class include wrong unit',
		},
		{
			code: 'a { color: #1f1f1f; }',
			description: 'ignore color hex',
		},
		{
			code: '@media (min-width: 10px) {}',
			description: '@media',
		},
		{
			code: '@media (min-width: 10px)\n  and (max-width: 20px) {}',
			description: 'complex @media',
		},
		{
			code: '@media screen and (min-width:0\\0) {}',
			description: 'ignore media query hack',
		},
		{
			code: "@import 'foo.css'",
			description: 'ignore non-media and non-variable at-rule',
		},
		{
			code: "a { background-image: image-set('img-1x.jpg' 1x, 'img-2x.jpg' 2x, 'img-3x.jpg' 3x) }",
			description: 'ignore `x` unit in image-set',
		},
		{
			code: "a { background-image: -webkit-image-set('img-1x.jpg' 1x, 'img-2x.jpg' 2x) }",
			description: 'ignore `x` unit in vendor-prefixd image-set',
		},
		{
			code: '@media (resolution: 2x) {}',
			description: 'ignore `x` unit in @media with `resolution`',
		},
		{
			code: '@media ( resOLution:  2x) {}',
			description: 'ignore `x` unit in @media with `resolution`',
		},
		{
			code: 'a { image-resolution: 1x; }',
			description: 'ignore `x` unit in image-resolution',
		},
	],

	reject: [
		{
			code: 'a { font-size: 13pp; }',
			message: messages.rejected('pp'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { margin: 13xpx; }',
			message: messages.rejected('xpx'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { font-size: .5remm; }',
			message: messages.rejected('remm'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { font-size: 0.5remm; }',
			message: messages.rejected('remm'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: rgb(255pix, 0, 51); }',
			message: messages.rejected('pix'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: hsl(255pix, 0, 51); }',
			message: messages.rejected('pix'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: rgba(255pix, 0, 51, 1); }',
			message: messages.rejected('pix'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: hsla(255pix, 0, 51, 1); }',
			message: messages.rejected('pix'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { margin: calc(13pix + 10px); }',
			message: messages.rejected('pix'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { margin: calc(10pix*2); }',
			message: messages.rejected('pix'),
			line: 1,
			column: 18,
			description: 'No whitespace',
		},
		{
			code: 'a { margin: calc(2*10pix); }',
			message: messages.rejected('pix'),
			line: 1,
			column: 20,
			description: 'No whitespace',
		},
		{
			code: 'a { -webkit-transition-delay: 10pix; }',
			message: messages.rejected('pix'),
			line: 1,
			column: 31,
		},
		{
			code: 'a { margin: -webkit-calc(13pix + 10px); }',
			message: messages.rejected('pix'),
			line: 1,
			column: 26,
		},
		{
			code: 'a { margin: some-function(13pix + 10px); }',
			message: messages.rejected('pix'),
			line: 1,
			column: 27,
		},
		{
			code: 'root { --margin: 10pix; }',
			message: messages.rejected('pix'),
			line: 1,
			column: 18,
		},
		{
			code: 'root { --margin: 10px + 10pix; }',
			message: messages.rejected('pix'),
			line: 1,
			column: 25,
		},
		{
			code: '@media (min-width: 13pix) {}',
			message: messages.rejected('pix'),
			description: '@media',
			line: 1,
			column: 20,
		},
		{
			code: '@media (min-width: 10px)\n  and (max-width: 20PIX) {}',
			message: messages.rejected('PIX'),
			description: 'complex @media',
			line: 2,
			column: 19,
		},
		{
			code: '@media (width < 10.01REMS) {}',
			message: messages.rejected('REMS'),
			description: 'media feature range',
			line: 1,
			column: 17,
		},
		{
			code: 'a { width: 1e4pz; }',
			message: messages.rejected('pz'),
			description: 'scientific notation in number values',
			line: 1,
			column: 12,
		},
		{
			code: 'a { flex: 0 9r9 auto; }',
			message: messages.rejected('r9'),
			description: 'typo in scientific notation in number values',
			line: 1,
			column: 13,
		},
		{
			code: 'a { width: 400x; }',
			message: messages.rejected('x'),
			description: '`x` is not allowed for non-resolution props',
			line: 1,
			column: 12,
		},
		{
			code: '@media (resolution: 2x) and (min-width: 200x) {}',
			message: messages.rejected('x'),
			description: '`x` rejected with inappropriate property',
			line: 1,
			column: 41,
		},
		{
			code: '@media ( resolution: /* comment */ 2x ) and (min-width: 200x) {}',
			message: messages.rejected('x'),
			description: '`x` rejected with inappropriate property',
			line: 1,
			column: 44,
		},
		{
			code:
				"a { background: image-set('img1x.png' 1x, 'img2x.png' 2x) left 20x / 15% 60% repeat-x; }",
			message: messages.rejected('x'),
			description: '`x` rejected with inappropriate property',
			line: 1,
			column: 64,
		},
		{
			code:
				"a { background: /* comment */ image-set('img1x.png' 1x, 'img2x.png' 2x) left 20x / 15% 60% repeat-x; }",
			message: messages.rejected('x'),
			description: '`x` rejected with inappropriate property',
			line: 1,
			column: 78,
		},
		{
			code: "a { background-image: image-set('img1x.png' 1pix, 'img2x.png' 2x); }",
			message: messages.rejected('pix'),
			description: '`pix` rejected with inappropriate property',
			line: 1,
			column: 45,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: [true],

	accept: [
		{
			code: 'a { width: 1em; \n// width: 10pix\n }',
			description: 'ignore wrong unit within comments',
		},
		{
			code: 'a { margin: #{$thumbnail-caption-padding}; }',
			description: 'ignore interpolation',
		},
		{
			code: 'a { margin: calc(100% - #{$margin * 2}); }',
			description: 'work with interpolation',
		},
		{
			code: '$foo: ( 1prop: 10px, 2prop: 12px, 3prop: /* comment */ 14px )',
			description: 'ignore map property name',
		},
		{
			code: '$breakpoints: ( small: /* comment */ 767px, 1medium: 992px, large: 1200px );',
			description: 'ignore map property name',
		},
		{
			code:
				'$breakpoints: ( small: /* comment */ 767px, medium: ( 1prop: 992px, 2prop: ( 1prop: 1200px ) ) );',
			description: 'ignore map property name in nested maps',
		},
	],

	reject: [
		{
			code: 'a { margin: 10pix + 10px; }',
			message: messages.rejected('pix'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { $margin: 10pix; }',
			message: messages.rejected('pix'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { $margin: 10px + 10pix; }',
			message: messages.rejected('pix'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { margin: $margin + 10pix; }',
			message: messages.rejected('pix'),
			line: 1,
			column: 23,
		},
		{
			code: '$breakpoints: ( small: 767px, medium: 992pix, large: 1200px );',
			message: messages.rejected('pix'),
			line: 1,
			column: 39,
		},
		{
			code: '$breakpoints: ( small: 767px, 1medium: 992pix, large: 1200px );',
			message: messages.rejected('pix'),
			line: 1,
			column: 40,
		},
		{
			code:
				'$breakpoints: ( small: /* comment */ 767px, medium: ( 1prop: 992pix, 2prop: ( 1prop: 1200px ) ) );',
			message: messages.rejected('pix'),
			line: 1,
			column: 49,
		},
		{
			code: 'a { font: (italic bold 10px/8pix) }',
			message: messages.rejected('pix'),
			line: 1,
			column: 29,
		},
		{
			code: 'font: 14pix/#{$line-height};',
			message: messages.rejected('pix'),
			line: 1,
			column: 7,
		},
		{
			code: 'a { margin: calc(100% - #{$margin * 2pix}); }',
			message: messages.rejected('pix'),
			line: 1,
			column: 37,
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: [true],

	accept: [
		{
			code: 'a { width: 1em; \n// width: 10pix\n }',
			description: 'ignore wrong unit within comments',
		},
		{
			code: '@56789a: #56789a;\na { color: @56789a; }',
			description: 'ignore variable names',
		},
	],

	reject: [
		{
			code: '@variable: 10pix',
			message: messages.rejected('pix'),
			line: 1,
			column: 12,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreUnits: ['pix', '/^my-/', '/^YOUR-/i'] }],

	accept: [
		{
			code: 'a { margin: 10px; }',
		},
		{
			code: 'a { margin: 10pix; }',
		},
		{
			code: 'a { margin: 10my-unit; }',
		},
		{
			code: 'a { margin: 10my-other-unit; }',
		},
		{
			code: 'a { margin: 10YOUR-unit; }',
		},
		{
			code: 'a { margin: 10your-unit; }',
		},
	],

	reject: [
		{
			code: 'a { margin: 10pixels; }',
			message: messages.rejected('pixels'),
		},
		{
			code: 'a { margin: 10pIx; }',
			message: messages.rejected('pIx'),
		},
		{
			code: 'a { margin: 10PIX; }',
			message: messages.rejected('PIX'),
		},
		{
			code: 'a { margin: 10not-my-unit; }',
			message: messages.rejected('not-my-unit'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreUnits: [/^my-/] }],

	accept: [
		{
			code: 'a { margin: 10my-unit; }',
		},
	],

	reject: [
		{
			code: 'a { margin: 10pixels; }',
			message: messages.rejected('pixels'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreFunctions: ['image-set', '/^my-/', '/^YOUR-/i'] }],

	accept: [
		{
			code:
				"a { background-image: image-set('/images/some-image-1x.jpg' 1x,'/images/some-image-2x.jpg' 2x,'/images/some-image-3x.jpg' 3x,); }",
		},
		{
			code:
				"a { background-image: my-image-set('/images/some-image-1x.jpg' 1x,'/images/some-image-2x.jpg' 2x,'/images/some-image-3x.jpg' 3x,); }",
		},
		{
			code:
				"a { background-image: YoUr-image-set('/images/some-image-1x.jpg' 1x,'/images/some-image-2x.jpg' 2x,'/images/some-image-3x.jpg' 3x,); }",
		},
	],

	reject: [
		{
			code: 'a { margin: calc(10pixels + 1pixels); }',
			warnings: [
				{
					message: messages.rejected('pixels'),
					line: 1,
					column: 18,
				},
				{
					message: messages.rejected('pixels'),
					line: 1,
					column: 29,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreFunctions: [/^my-/] }],

	accept: [
		{
			code:
				"a { background-image: my-image-set('/images/some-image-1x.jpg' 1x,'/images/some-image-2x.jpg' 2x,'/images/some-image-3x.jpg' 3x,); }",
		},
	],

	reject: [
		{
			code: 'a { margin: calc(10pixels + 1pixels); }',
			warnings: [
				{
					message: messages.rejected('pixels'),
					line: 1,
					column: 18,
				},
				{
					message: messages.rejected('pixels'),
					line: 1,
					column: 29,
				},
			],
		},
	],
});
