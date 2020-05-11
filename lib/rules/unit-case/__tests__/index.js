'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['lower'],
	fix: true,

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
			code: 'a { font-size: .5rem; }',
		},
		{
			code: 'a { font-size: 0.5rem; }',
		},
		{
			code: 'a { width: 10px; }',
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
			code: 'a { top: calc(10px*2rem); }',
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
		},
		{
			code: 'a { transform: rotate(90deg); }',
		},
		{
			code: 'a { color: green; }',
			description: 'ignore keyword',
		},
		{
			code: 'a { color: green10PX; }',
			description: 'ignore unit within keyword',
		},
		{
			code: 'a { width: /* 100PX */ 1em; }',
			description: 'ignore unit within comments',
		},
		{
			code: 'a::before { content: "10PX"}',
			description: 'ignore unit within quotes',
		},
		{
			code: 'a { font-size: $fs10PX; }',
			description: 'ignore preprocessor variable includes unit',
		},
		{
			code: 'a { font-size: @fs10PX; }',
			description: 'ignore preprocessor variable includes unit',
		},
		{
			code: 'a { font-size: var(--some-fs-10PX); }',
			description: 'ignore css variable includes unit',
		},
		{
			code: 'a { margin: url(13PX); }',
			description: 'ignore url function',
		},
		{
			code: 'a { margin: uRl(13PX); }',
			description: 'ignore url function',
		},
		{
			code: 'a { margin: URL(13PX); }',
			description: 'ignore url function',
		},
		{
			code: 'a { marginPX: 10px; }',
			description: 'ignore property include unit',
		},
		{
			code: 'a10PX { margin: 10px; }',
			description: 'ignore type selector include unit',
		},
		{
			code: '#a10PX { margin: 10px; }',
			description: 'ignore class selector include unit',
		},
		{
			code: '.a10PX { margin: 10px; }',
			description: 'ignore class selector include unit',
		},
		{
			code: 'input[type=10PX] { margin: 10px; }',
			description: 'ignore class selector include unit',
		},
		{
			code: 'a:hover10PX { margin: 10px; }',
			description: 'ignore pseudo-class include unit',
		},
		{
			code: 'a::before10PX { margin: 10px; }',
			description: 'ignore pseudo-class include unit',
		},
		{
			code: 'a { margin: 13xpx; }',
			description: 'work with unknown units',
		},
		{
			code: '@media (min-width: 10px) {}',
			description: 'check @media',
		},
		{
			code: '@media (min-width: 10px)\n  and (max-width: 20px) {}',
			description: 'check complex @media',
		},
		{
			code: '@media not screen and (min-width: 100px) {}',
			description: 'negation @media',
		},
		{
			code: "@import 'foo.css'",
			description: 'ignore non-media and non-variable at-rule',
		},
	],

	reject: [
		{
			code: 'a { width: 10pX; }',
			fixed: 'a { width: 10px; }',
			message: messages.expected('pX', 'px'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { width: 10Px; }',
			fixed: 'a { width: 10px; }',
			message: messages.expected('Px', 'px'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { width: 10PX; }',
			fixed: 'a { width: 10px; }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { margin: 10px 10PX; }',
			fixed: 'a { margin: 10px 10px; }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { font-size: .5REM; }',
			fixed: 'a { font-size: .5rem; }',
			message: messages.expected('REM', 'rem'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { font-size: 0.5REM; }',
			fixed: 'a { font-size: 0.5rem; }',
			message: messages.expected('REM', 'rem'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { margin: calc(10px + 10PX); }',
			fixed: 'a { margin: calc(10px + 10px); }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 25,
		},
		{
			code: 'a { top: calc(10px*2REM); }',
			fixed: 'a { top: calc(10px*2rem); }',
			message: messages.expected('REM', 'rem'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { margin: -webkit-calc(13PX + 10px); }',
			fixed: 'a { margin: -webkit-calc(13px + 10px); }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 26,
		},
		{
			code: 'a { margin: some-function(13PX + 10px); }',
			fixed: 'a { margin: some-function(13px + 10px); }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 27,
		},
		{
			code: 'root { --margin: 10PX; }',
			fixed: 'root { --margin: 10px; }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 18,
		},
		{
			code: 'root { --margin: 10px + 10PX; }',
			fixed: 'root { --margin: 10px + 10px; }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 25,
		},
		{
			code: 'a { margin: 13XPX; }',
			fixed: 'a { margin: 13xpx; }',
			message: messages.expected('XPX', 'xpx'),
			description: 'work with unknown units',
			line: 1,
			column: 13,
		},
		{
			code: '@media (min-width: 13PX) {}',
			fixed: '@media (min-width: 13px) {}',
			message: messages.expected('PX', 'px'),
			description: '@media',
			line: 1,
			column: 20,
		},
		{
			code: '@media (min-width: 10px)\n  and (max-width: 20PX) {}',
			fixed: '@media (min-width: 10px)\n  and (max-width: 20px) {}',
			message: messages.expected('PX', 'px'),
			description: 'complex @media',
			line: 2,
			column: 19,
		},
		{
			code: '@media (width < 10.01REM) {}',
			fixed: '@media (width < 10.01rem) {}',
			message: messages.expected('REM', 'rem'),
			description: 'media feature range',
			line: 1,
			column: 17,
		},
		{
			code: '@media not screen and (min-width: 100PX) {}',
			fixed: '@media not screen and (min-width: 100px) {}',
			message: messages.expected('PX', 'px'),
			description: 'negation @media',
			line: 1,
			column: 35,
		},
		{
			code: '@media not screen and (min-width: 100PX) { width: 100Px; }',
			fixed: '@media not screen and (min-width: 100px) { width: 100px; }',
			description: 'negation @media',
			warnings: [
				{
					message: messages.expected('PX', 'px'),
					line: 1,
					column: 35,
				},
				{
					message: messages.expected('Px', 'px'),
					line: 1,
					column: 51,
				},
			],
		},
		{
			code: 'a { background: url("10PX.png") 10PX 20px no-repeat; }',
			fixed: 'a { background: url("10PX.png") 10px 20px no-repeat; }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 33,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: ['lower'],
	fix: true,

	accept: [
		{
			code: 'a { width: 1em; \n// width: 10PX\n }',
			description: 'ignore unit within comments',
		},
		{
			code: 'a { margin: calc(100% - #{$margin * 2}); }',
			description: 'work with interpolation',
		},
	],

	reject: [
		{
			code: 'a { margin: 10PX; }',
			fixed: 'a { margin: 10px; }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 10pX; }',
			fixed: 'a { margin: 10px; }',
			message: messages.expected('pX', 'px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 10Px; }',
			fixed: 'a { margin: 10px; }',
			message: messages.expected('Px', 'px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 10PX + 10px; }',
			fixed: 'a { margin: 10px + 10px; }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { $margin: 10PX; }',
			fixed: 'a { $margin: 10px; }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { $margin: 10px + 10PX; }',
			fixed: 'a { $margin: 10px + 10px; }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { margin: $margin + 10PX; }',
			fixed: 'a { margin: $margin + 10px; }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 23,
		},
		{
			code: '$breakpoints: ( small: 767px, medium: 992PX, large: 1200px );',
			fixed: '$breakpoints: ( small: 767px, medium: 992px, large: 1200px );',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 39,
		},
		{
			code: 'a { font: (italic bold 10px/8PX) }',
			fixed: 'a { font: (italic bold 10px/8px) }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 29,
		},
		{
			code: 'font: 14PX/#{$line-height};',
			fixed: 'font: 14px/#{$line-height};',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 7,
		},
		{
			code: 'a { margin: calc(100% - #{$margin * 2PX}); }',
			fixed: 'a { margin: calc(100% - #{$margin * 2px}); }',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 37,
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: ['lower'],
	fix: true,

	accept: [
		{
			code: 'a { width: 1em; \n// width: 10PX\n }',
			description: 'ignore unit within comments',
		},
	],

	reject: [
		{
			code: '@variable: 10PX',
			fixed: '@variable: 10px',
			message: messages.expected('PX', 'px'),
			line: 1,
			column: 12,
		},
		{
			code: '@variable: 10pX',
			fixed: '@variable: 10px',
			message: messages.expected('pX', 'px'),
			line: 1,
			column: 12,
		},
		{
			code: '@variable: 10Px',
			fixed: '@variable: 10px',
			message: messages.expected('Px', 'px'),
			line: 1,
			column: 12,
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	fix: true,

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
			code: 'a { font-size: .5REM; }',
		},
		{
			code: 'a { font-size: 0.5REM; }',
		},
		{
			code: 'a { width: 10PX; }',
		},
		{
			code: 'a { margin: 0 10EM 5REM 2IN; }',
		},
		{
			code: 'a { background-position: top right, 1EM 5VH; }',
		},
		{
			code: 'a { top: calc(10EM - 3EM); }',
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100% - 50EM), silver); }',
		},
		{
			code: 'a { transform: rotate(90DEG); }',
		},
		{
			code: 'a { color: green; }',
			description: 'ignore keyword',
		},
		{
			code: 'a { color: green10px; }',
			description: 'ignore unit within keyword',
		},
		{
			code: 'a { width: /* 100px */ 1EM; }',
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
			code: 'a { font-size: @fs10px; }',
			description: 'ignore preprocessor variable includes unit',
		},
		{
			code: 'a { font-size: var(--some-fs-10px); }',
			description: 'ignore css variable includes unit',
		},
		{
			code: 'a { margin: url(13px); }',
			description: 'ignore url function',
		},
		{
			code: 'a { margin10px: 10PX; }',
			description: 'ignore property include unit',
		},
		{
			code: 'a10px { margin: 10PX; }',
			description: 'ignore type selector include unit',
		},
		{
			code: '#a10px { margin: 10PX; }',
			description: 'ignore class selector include unit',
		},
		{
			code: '.a10px { margin: 10PX; }',
			description: 'ignore class selector include unit',
		},
		{
			code: 'input[type=10px] { margin: 10PX; }',
			description: 'ignore class selector include unit',
		},
		{
			code: 'a:hover10px { margin: 10PX; }',
			description: 'ignore pseudo-class include unit',
		},
		{
			code: 'a::before10px { margin: 10PX; }',
			description: 'ignore pseudo-class include unit',
		},
		{
			code: 'a { margin: 13XPX; }',
			description: 'work with unknown units',
		},
	],

	reject: [
		{
			code: 'a { width: 10pX; }',
			fixed: 'a { width: 10PX; }',
			message: messages.expected('pX', 'PX'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { width: 10Px; }',
			fixed: 'a { width: 10PX; }',
			message: messages.expected('Px', 'PX'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { width: 10px; }',
			fixed: 'a { width: 10PX; }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { font-size: .5rem; }',
			fixed: 'a { font-size: .5REM; }',
			message: messages.expected('rem', 'REM'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { font-size: 0.5rem; }',
			fixed: 'a { font-size: 0.5REM; }',
			message: messages.expected('rem', 'REM'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { margin: 10PX 10px; }',
			fixed: 'a { margin: 10PX 10PX; }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { margin: calc(10PX + 10px); }',
			fixed: 'a { margin: calc(10PX + 10PX); }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 25,
		},
		{
			code: 'a { margin: -webkit-calc(13px + 10PX); }',
			fixed: 'a { margin: -webkit-calc(13PX + 10PX); }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 26,
		},
		{
			code: 'a { margin: some-function(13px + 10PX); }',
			fixed: 'a { margin: some-function(13PX + 10PX); }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 27,
		},
		{
			code: 'root { --margin: 10px; }',
			fixed: 'root { --margin: 10PX; }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 18,
		},
		{
			code: 'root { --margin: 10PX + 10px; }',
			fixed: 'root { --margin: 10PX + 10PX; }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 25,
		},
		{
			code: 'a { margin: 13xpx; }',
			fixed: 'a { margin: 13XPX; }',
			message: messages.expected('xpx', 'XPX'),
			description: 'work with unknown units',
			line: 1,
			column: 13,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: ['upper'],
	fix: true,

	accept: [
		{
			code: 'a { width: 1EM; \n// width: 10px\n }',
			description: 'ignore unit within comments',
		},
		{
			code: 'a { margin: calc(100% - #{$margin * 2}); }',
			description: 'work with interpolation',
		},
	],

	reject: [
		{
			code: 'a { margin: 10px; }',
			fixed: 'a { margin: 10PX; }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 10pX; }',
			fixed: 'a { margin: 10PX; }',
			message: messages.expected('pX', 'PX'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 10Px; }',
			fixed: 'a { margin: 10PX; }',
			message: messages.expected('Px', 'PX'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 10px + 10PX; }',
			fixed: 'a { margin: 10PX + 10PX; }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { $margin: 10px; }',
			fixed: 'a { $margin: 10PX; }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { $margin: 10PX + 10px; }',
			fixed: 'a { $margin: 10PX + 10PX; }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { margin: $margin + 10px; }',
			fixed: 'a { margin: $margin + 10PX; }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 23,
		},
		{
			code: '$breakpoints: ( small: 767PX, medium: 992px, large: 1200PX );',
			fixed: '$breakpoints: ( small: 767PX, medium: 992PX, large: 1200PX );',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 39,
		},
		{
			code: 'a { font: (italic bold 10PX/8px) }',
			fixed: 'a { font: (italic bold 10PX/8PX) }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 29,
		},
		{
			code: 'font: 14px/#{$line-height};',
			fixed: 'font: 14PX/#{$line-height};',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 7,
		},
		{
			code: 'a { margin: calc(100% - #{$margin * 2px}); }',
			fixed: 'a { margin: calc(100% - #{$margin * 2PX}); }',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 37,
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: ['upper'],
	fix: true,

	accept: [
		{
			code: 'a { width: 1EM; \n// width: 10px\n }',
			description: 'ignore unit within comments',
		},
	],

	reject: [
		{
			code: '@variable: 10px',
			fixed: '@variable: 10PX',
			message: messages.expected('px', 'PX'),
			line: 1,
			column: 12,
		},
		{
			code: '@variable: 10pX',
			fixed: '@variable: 10PX',
			message: messages.expected('pX', 'PX'),
			line: 1,
			column: 12,
		},
		{
			code: '@variable: 10Px',
			fixed: '@variable: 10PX',
			message: messages.expected('Px', 'PX'),
			line: 1,
			column: 12,
		},
	],
});
