'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: ['extend', 'supports', 'keyframes'],

	accept: [
		{
			code: 'a { color: pink; }',
			description: 'Some random code.',
		},
		{
			code: '@mixin name ($p) {}',
			description: '@rule not from a blacklist.',
		},
	],

	reject: [
		{
			code: 'a { @extend %placeholder; }',
			message: messages.rejected('extend'),
			line: 1,
			column: 5,
			description: '@rule from a blacklist, is a Sass directive.',
		},
		{
			code: `
      a {
        @extend
        %placeholder;
      }
    `,
			message: messages.rejected('extend'),
			line: 3,
			column: 9,
			description: '@rule from a blacklist; newline after its name.',
		},
		{
			code: `
      @keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			message: messages.rejected('keyframes'),
			line: 2,
			description: '@rule from a blacklist; independent rule.',
		},
		{
			code: `
      @Keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			message: messages.rejected('Keyframes'),
			line: 2,
			column: 7,
			description: '@rule from a blacklist; independent rule; messed case.',
		},
		{
			code: `
      @-moz-keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			message: messages.rejected('-moz-keyframes'),
			line: 2,
			column: 7,
			description: '@rule from a blacklist; independent rule; has vendor prefix.',
		},
		{
			code: `
      @-WEBKET-KEYFRAMES name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			message: messages.rejected('-WEBKET-KEYFRAMES'),
			line: 2,
			column: 7,
			description: '@rule from a blacklist; independent rule; has vendor prefix.',
		},
	],
});

testRule({
	ruleName,

	config: ['keyframes'],

	accept: [
		{
			code: 'a { color: pink; }',
			description: 'Some random code.',
		},
		{
			code: '@mixin name ($p) {}',
			description: '@rule not from a blacklist.',
		},
	],

	reject: [
		{
			code: `
      @keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			message: messages.rejected('keyframes'),
			line: 2,
			column: 7,
			description: '@rule from a blacklist; independent rule.',
		},
		{
			code: `
      @Keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			message: messages.rejected('Keyframes'),
			line: 2,
			column: 7,
			description: '@rule from a blacklist; independent rule; messed case.',
		},
		{
			code: `
      @-moz-keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			message: messages.rejected('-moz-keyframes'),
			line: 2,
			column: 7,
			description: '@rule from a blacklist; independent rule; has vendor prefix.',
		},
		{
			code: `
      @-WEBKET-KEYFRAMES name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
			message: messages.rejected('-WEBKET-KEYFRAMES'),
			line: 2,
			column: 7,
			description: '@rule from a blacklist; independent rule; has vendor prefix.',
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: ['keyframes'],

	accept: [
		{
			code: `
        .keyframes() { margin: 0; }

        span { .keyframes(); }
      `,
			description: 'ignore Less mixin which are treated as at-rule',
		},
	],
});
