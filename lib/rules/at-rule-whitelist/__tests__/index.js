'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: ['extend', 'import', 'keyframes'],

	accept: [
		{
			code: 'a { color: pink; }',
			description: 'Some random code.',
		},
		{
			code: 'a { @extend %placeholder; }',
			description: '@rule from a whitelist, is a Sass directive.',
		},
		{
			code: `
      a {
        @extend
        %placeholder;
      }
    `,
			description: '@rule from a whitelist; newline after its name.',
		},
		{
			code: `
      @keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			description: '@rule from a whitelist; independent rule.',
		},
		{
			code: `
      @Keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			description: '@rule from a whitelist; independent rule; messed case.',
		},
		{
			code: `
      @-moz-keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			description: '@rule from a whitelist; independent rule; has vendor prefix.',
		},
		{
			code: `
      @-WEBKET-KEYFRAMES name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			description: '@rule from a whitelist; independent rule; has vendor prefix.',
		},
	],

	reject: [
		{
			code: `
      @mixin name () {}
    `,
			line: 2,
			columt: 7,
			message: messages.rejected('mixin'),
			description: '@rule not from a whitelist; independent rule.',
		},
	],
});

testRule({
	ruleName,
	skipBasicChecks: true,

	config: ['keyframes'],

	accept: [
		{
			code: `
      @keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			description: '@rule from a whitelist; independent rule.',
		},
		{
			code: `
      @Keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			description: '@rule from a whitelist; independent rule; messed case.',
		},
		{
			code: `
      @-moz-keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			description: '@rule from a whitelist; independent rule; has vendor prefix.',
		},
		{
			code: `
      @-WEBKET-KEYFRAMES name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			description: '@rule from a whitelist; independent rule; has vendor prefix.',
		},
	],

	reject: [
		{
			code: `
      @mixin name ($p) {}
    `,
			message: messages.rejected('mixin'),
			line: 2,
			column: 7,
			description: '@rule not from a whitelist.',
		},
		{
			code: "@import 'path/to/file.css';",
			message: messages.rejected('import'),
			line: 1,
			column: 1,
			description: '@rule not from a whitelist.',
		},
		{
			code: '@media screen and (max-witdh: 1000px) {}',
			message: messages.rejected('media'),
			line: 1,
			column: 1,
			description: '@rule not from a whitelist.',
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: ['keyframes'],
	skipBasicChecks: true,

	accept: [
		{
			code: `
        .mixin() { margin: 0; }

        span { .mixin(); }
      `,
			description: 'ignore Less mixin which are treated as at-rule',
		},
	],
});
