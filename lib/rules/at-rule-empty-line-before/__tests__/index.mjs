import { stripIndent } from 'common-tags';

import mergeTestDescriptions from '../../../testUtils/mergeTestDescriptions.mjs';
import rule from '../index.mjs';
const { messages, ruleName } = rule;

const sharedAlwaysTests = {
	accept: [
		{
			code: 'a {} b {}',
			description: 'rule ignored',
		},
		{
			code: '@font-face {}',
			description: 'first node ignored',
		},
		{
			code: 'a {}\n\n@media {}',
		},
		{
			code: 'a {}\n\n@mEdIa {}',
		},
		{
			code: 'a {}\n\n@MEDIA {}',
		},
		{
			code: '@keyframes foo {}\n\n@media {}',
		},
		{
			code: '@kEyFrAmEs foo {}\n\n@MeDia {}',
		},
		{
			code: '@KEYFRAMES foo {}\n\n@MEDIA {}',
		},
		{
			code: '@-webkit-keyframes foo {}\n\n@media {}',
		},
		{
			code: '@-webkit-keyframes foo {}\n\n@-webkit-keyframes bar {}',
		},
		{
			code: 'a {}\r\n\r\n@media {}',
			description: 'windows',
		},
		{
			code: 'a {}\n\r\n@media {}',
			description: 'mixed',
		},
	],

	reject: [
		{
			code: 'a {} @media {}',
			fixed: 'a {}\n\n @media {}',
			message: messages.expected,
			fix: { range: [3, 4], text: '}\n\n' },
		},
		{
			code: 'a {} @mEdIa {}',
			fixed: 'a {}\n\n @mEdIa {}',
			message: messages.expected,
			fix: { range: [3, 4], text: '}\n\n' },
		},
		{
			code: 'a {} @MEDIA {}',
			fixed: 'a {}\n\n @MEDIA {}',
			message: messages.expected,
			fix: { range: [3, 4], text: '}\n\n' },
		},
		{
			code: '@keyframes foo {} @media {}',
			fixed: '@keyframes foo {}\n\n @media {}',
			message: messages.expected,
			fix: { range: [16, 17], text: '}\n\n' },
		},
		{
			code: '@-webkit-keyframes foo {} @media {}',
			fixed: '@-webkit-keyframes foo {}\n\n @media {}',
			message: messages.expected,
			fix: { range: [24, 25], text: '}\n\n' },
		},
		{
			code: '@-webkit-keyframes foo {} @-webkit-keyframes bar {}',
			fixed: '@-webkit-keyframes foo {}\n\n @-webkit-keyframes bar {}',
			message: messages.expected,
			fix: { range: [24, 25], text: '}\n\n' },
		},
		{
			code: 'a {}\n@media {}',
			fixed: 'a {}\n\n@media {}',
			message: messages.expected,
			fix: { range: [4, 5], text: '\n\n' },
		},
		{
			code: 'a {}\r\n@media {}',
			fixed: 'a {}\r\n\r\n@media {}',
			message: messages.expected,
			fix: { range: [5, 6], text: '\n\r\n' },
		},
		{
			code: 'a {}\n\n/* comment */\n@media {}',
			fixed: 'a {}\n\n/* comment */\n\n@media {}',
			message: messages.expected,
			fix: { range: [19, 20], text: '\n\n' },
		},
		{
			code: 'a {}\r\n\r\n/* comment */\r\n@media {}',
			fixed: 'a {}\r\n\r\n/* comment */\r\n\r\n@media {}',
			message: messages.expected,
			fix: { range: [22, 23], text: '\n\r\n' },
		},
	],
};

const sharedNeverTests = {
	accept: [
		{
			code: 'a {}\n\nb {}',
			description: 'rule ignored',
		},
		{
			code: '\n\n@font-face {}',
			description: 'first node ignored',
		},
		{
			code: 'a {}\n@media {}',
		},
		{
			code: 'a {} @media {}',
		},
		{
			code: '@keyframes foo {}\n@media {}',
		},
		{
			code: '@keyframes foo {} @media {}',
		},
	],

	reject: [
		{
			code: 'a {}\n\n@media {}',
			fixed: 'a {}\n@media {}',
			message: messages.rejected,
			fix: { range: [5, 6], text: '' },
		},
		{
			code: 'a {}\r\n\r\n@media {}',
			fixed: 'a {}\r\n@media {}',
			message: messages.rejected,
			fix: { range: [6, 8], text: '' },
		},
		{
			code: '@keyframes foo {}\n/* comment */\n\n@media {}',
			fixed: '@keyframes foo {}\n/* comment */\n@media {}',
			message: messages.rejected,
			fix: { range: [32, 33], text: '' },
		},
		{
			code: '@keyframes foo {}\r\n/* comment */\r\n\r\n@media {}',
			fixed: '@keyframes foo {}\r\n/* comment */\r\n@media {}',
			message: messages.rejected,
			fix: { range: [34, 36], text: '' },
		},
	],
};

testRule(
	mergeTestDescriptions(sharedAlwaysTests, {
		ruleName,
		config: ['always'],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n\n  @mixin foo;\n}',
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedAlwaysTests, {
		ruleName,
		config: ['always', { except: ['blockless-after-blockless'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n\n  @mixin foo;\n}',
			},
			{
				code: "@keyframes foo {}\n\n@import 'x.css'",
				description: 'empty line not blockless pair',
			},
			{
				code: "@import 'x.css';\n@import 'y.css'",
				description: 'no empty line blockless pair',
			},
			{
				code: "@import 'x.css';",
				description: 'single blockless rule',
			},
		],

		reject: [
			{
				code: "@keyframes foo {}\n@import 'x.css'",
				fixed: "@keyframes foo {}\n\n@import 'x.css'",
				message: messages.expected,
				fix: { range: [17, 18], text: '\n\n' },
			},
			{
				code: "@import 'x.css';\n\n@import 'y.css'",
				fixed: "@import 'x.css';\n@import 'y.css'",
				message: messages.rejected,
				fix: { range: [17, 18], text: '' },
			},
		],
	}),
);

testRule({
	ruleName,
	config: ['always', { except: ['blockless-after-blockless'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: "@import 'y.css'; @import 'x.css';",
		},
		{
			code: stripIndent`
      @charset "UTF-8";
      @import url(x.css); /* comment */
      @import url(y.css);`,
			description: 'shared-line comment accepted',
		},
	],

	reject: [
		{
			code: "@keyframes foo {}\n@import 'x.css'",
			fixed: "@keyframes foo {}\n\n@import 'x.css'",
			message: messages.expected,
			fix: { range: [17, 18], text: '\n\n' },
		},
		{
			code: "@import 'x.css';\n\n@import 'y.css'",
			fixed: "@import 'x.css';\n@import 'y.css'",
			message: messages.rejected,
			fix: { range: [17, 18], text: '' },
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['blockless-after-blockless'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: "@charset 'UTF-8'; @import 'x.css';",
		},
	],

	reject: [
		{
			code: "@import 'x.css'; @media {};",
			fixed: "@import 'x.css';\n\n @media {};",
			message: messages.expected,
			line: 1,
			column: 18,
			fix: { range: [15, 16], text: ';\n\n' },
		},
		{
			code: "@import 'test'; @include mixin(1) { @content; };",
			fixed: "@import 'test';\n\n @include mixin(1) { @content; };",
			message: messages.expected,
			fix: { range: [14, 15], text: ';\n\n' },
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['after-comment'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '/* foo */\n@media {}',
		},
		{
			code: '/* foo */\n\n@media{}',
		},
		{
			code: '/* foo */\r\n\r\n@media {}',
			description: 'CRLF',
		},
	],

	reject: [
		{
			code: 'a {} @media {}',
			fixed: 'a {}\n\n @media {}',
			message: messages.expected,
			fix: { range: [3, 4], text: '}\n\n' },
		},
		{
			code: 'bar {} /* foo */\n@media {}',
			fixed: 'bar {} /* foo */\n\n@media {}',
			message: messages.expected,
			line: 2,
			column: 1,
			description: 'after shared-line comment',
			fix: { range: [16, 17], text: '\n\n' },
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['first-nested'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@supports {\n  @media {}\n}',
		},
		{
			code: '@supports {\n\n  @media {}\n}',
		},
	],

	reject: [
		{
			code: '@supports {\n  @media {}\n  @media{}\n}',
			fixed: '@supports {\n  @media {}\n\n  @media{}\n}',
			message: messages.expected,
			line: 3,
			column: 3,
			fix: { range: [23, 24], text: '\n\n' },
		},
	],
});

testRule(
	mergeTestDescriptions(sharedAlwaysTests, {
		ruleName,
		config: ['always', { except: ['inside-block'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n  @mixin foo;\n  color: pink;\n}',
			},
			{
				code: 'a {\n  color: pink;\n  @mixin foo;\n}',
			},
		],

		reject: [
			{
				code: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
				fixed: 'a {\n  @mixin foo;\n  color: pink;\n}',
				message: messages.rejected,
				fix: { range: [4, 5], text: '' },
			},
			{
				code: 'a {\n\n  color: pink;\n\n  @mixin foo;\n}',
				fixed: 'a {\n\n  color: pink;\n  @mixin foo;\n}',
				message: messages.rejected,
				fix: { range: [20, 21], text: '' },
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedAlwaysTests, {
		ruleName,
		config: ['always', { except: ['first-nested'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n  @mixin foo;\n  color: pink;\n}',
			},
			{
				code: 'a { /* comment */\n  @mixin foo;\n  color: pink;\n}',
				description: 'shared-line comment',
			},
		],

		reject: [
			{
				code: 'a {\n  color: pink;\n  @mixin foo;\n}',
				fixed: 'a {\n  color: pink;\n\n  @mixin foo;\n}',
				message: messages.expected,
				fix: { range: [18, 19], text: '\n\n' },
			},
			{
				code: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
				fixed: 'a {\n  @mixin foo;\n  color: pink;\n}',
				message: messages.rejected,
				fix: { range: [4, 5], text: '' },
			},
			{
				code: 'a {/* comment */\n\n  @mixin foo;\n  color: pink;\n}',
				fixed: 'a {/* comment */\n  @mixin foo;\n  color: pink;\n}',
				message: messages.rejected,
				fix: { range: [17, 18], text: '' },
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedAlwaysTests, {
		ruleName,
		config: ['always', { ignore: ['inside-block'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n  @mixin foo;\n  color: pink;\n}',
			},
			{
				code: 'a {\n  color: pink;\n  @mixin foo;\n}',
			},
			{
				code: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
			},
			{
				code: 'a {\n\n  color: pink;\n\n  @mixin foo;\n}',
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedAlwaysTests, {
		ruleName,
		config: ['always', { except: ['blockless-after-blockless', 'inside-block'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n  @mixin foo;\n  color: pink;\n}',
			},
			{
				code: 'a {\n  color: pink;\n  @mixin foo;\n}',
			},
			{
				code: "@keyframes foo {}\n\n@import 'x.css'",
				description: 'empty line not blockless pair',
			},
			{
				code: "@import 'x.css';\n@import 'y.css'",
				description: 'no empty line blockless pair',
			},
			{
				code: "@import 'x.css';",
				description: 'single blockless rule',
			},
			{
				code: 'a {\n  @mixin foo;\n  @mixin bar;\n}',
			},
		],

		reject: [
			{
				code: "@keyframes foo {}\n@import 'x.css'",
				fixed: "@keyframes foo {}\n\n@import 'x.css'",
				message: messages.expected,
				fix: { range: [17, 18], text: '\n\n' },
			},
			{
				code: "@import 'x.css';\n\n@import 'y.css'",
				fixed: "@import 'x.css';\n@import 'y.css'",
				message: messages.rejected,
				fix: { range: [17, 18], text: '' },
			},
			{
				code: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
				fixed: 'a {\n  @mixin foo;\n  color: pink;\n}',
				message: messages.rejected,
				fix: { range: [4, 5], text: '' },
			},
			{
				code: 'a {\n\n  color: pink;\n\n  @mixin foo;\n}',
				fixed: 'a {\n\n  color: pink;\n  @mixin foo;\n}',
				message: messages.rejected,
				fix: { range: [20, 21], text: '' },
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedNeverTests, {
		ruleName,
		config: ['never'],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n  @mixin foo;\n}',
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedNeverTests, {
		ruleName,
		config: ['never', { except: ['blockless-after-blockless'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n  @mixin foo;\n}',
			},
			{
				code: "@keyframes foo {}\n@import 'x.css'",
				description: 'no empty line not blockless pair',
			},
			{
				code: "@import 'x.css';\n\n@import 'y.css'",
				description: 'empty line blockless pair',
			},
			{
				code: "@import 'x.css';",
				description: 'single blockless rule',
			},
		],

		reject: [
			{
				code: "@keyframes foo {}\n\n@import 'x.css'",
				fixed: "@keyframes foo {}\n@import 'x.css'",
				message: messages.rejected,
				fix: { range: [18, 19], text: '' },
			},
			{
				code: "@import 'x.css';\n@import 'y.css'",
				fixed: "@import 'x.css';\n\n@import 'y.css'",
				message: messages.expected,
				fix: { range: [16, 17], text: '\n\n' },
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedNeverTests, {
		ruleName,
		config: ['never', { except: ['inside-block'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
			},
			{
				code: 'a {\n  color: pink;\n\n  @mixin foo;\n}',
			},
		],

		reject: [
			{
				code: 'a {\n  @mixin foo;\n  color: pink;\n}',
				fixed: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
				message: messages.expected,
				fix: { range: [3, 4], text: '\n\n' },
			},
			{
				code: 'a {\n\n  color: pink;\n  @mixin foo;\n}',
				fixed: 'a {\n\n  color: pink;\n\n  @mixin foo;\n}',
				message: messages.expected,
				fix: { range: [19, 20], text: '\n\n' },
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedNeverTests, {
		ruleName,
		config: ['never', { except: ['first-nested'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
			},
		],

		reject: [
			{
				code: 'a {\n  color: pink;\n\n  @mixin foo;\n}',
				fixed: 'a {\n  color: pink;\n  @mixin foo;\n}',
				message: messages.rejected,
				fix: { range: [19, 20], text: '' },
			},
			{
				code: 'a {\n  @mixin foo;\n  color: pink;\n}',
				fixed: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
				message: messages.expected,
				fix: { range: [3, 4], text: '\n\n' },
			},
		],
	}),
);

testRule({
	ruleName,
	config: ['never', { ignore: ['blockless-after-blockless'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: `
      @media {};
      @import 'x.css';
    `,
		},
		{
			code: `
      @import 'x.css';
      @import 'y.css';
    `,
		},
		{
			code: `
      @import 'x.css';

      @import 'y.css';
    `,
		},
	],

	reject: [
		{
			code: `
      @import 'x.css';

      @media {};
    `,
			fixed: `
      @import 'x.css';
      @media {};
    `,
			message: messages.rejected,
			line: 4,
			column: 7,
			fix: { range: [24, 25], text: '' },
		},
	],
});

testRule({
	ruleName,
	config: ['never', { ignore: ['after-comment'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '/* foo */\n@media {}',
		},
		{
			code: '/* foo */\r\n\r\n@media {}',
			description: 'CRLF',
		},
		{
			code: '/* foo */\n\n@media {}',
		},
	],

	reject: [
		{
			code: 'b {}\n\n@media {}',
			fixed: 'b {}\n@media {}',
			message: messages.rejected,
			fix: { range: [5, 6], text: '' },
		},
		{
			code: 'b {}\r\n\r\n@media {}',
			fixed: 'b {}\r\n@media {}',
			description: 'CRLF',
			message: messages.rejected,
			fix: { range: [6, 8], text: '' },
		},
		{
			code: 'b {} /* comment */\n\n@media {}',
			fixed: 'b {} /* comment */\n@media {}',
			description: 'after shared-line comment',
			message: messages.rejected,
			line: 3,
			column: 1,
			fix: { range: [19, 20], text: '' },
		},
	],
});

testRule(
	mergeTestDescriptions(sharedNeverTests, {
		ruleName,
		config: ['never', { ignore: ['inside-block'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n  @mixin foo;\n  color: pink;\n}',
			},
			{
				code: 'a {\n  color: pink;\n  @mixin foo;\n}',
			},
			{
				code: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
			},
			{
				code: 'a {\n\n  color: pink;\n\n  @mixin foo;\n}',
			},
		],
	}),
);

testRule({
	ruleName,
	config: ['always', { ignoreAtRules: ['else'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: `
      @if(true) {
      } @else {
      }
    `,
		},
		{
			code: `
      @if(true) {
      }

      @else {
      }
    `,
		},
		{
			code: `
      @if(true) {}
      @else if(true) {
      }  @else {
      }
    `,
		},
	],

	reject: [
		{
			code: `
      @if(true) {
      } @else-mixin {
      }
    `,
			fixed: `
      @if(true) {
      }

 @else-mixin {
      }
    `,
			message: messages.expected,
			line: 3,
			column: 9,
			fix: { range: [25, 26], text: '}\n\n' },
		},
		{
			code: `
      @if (true) {}
      @if (false) {
      }
    `,
			fixed: `
      @if (true) {}

      @if (false) {
      }
    `,
			message: messages.expected,
			line: 3,
			column: 7,
			fix: { range: [20, 21], text: '\n\n' },
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignoreAtRules: /^--my-/ }],

	accept: [
		{
			code: `
			a {}
			@--my-at-rule {}
		`,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignoreAtRules: '/el/' }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@keyframes {}; @an-element-mixin();',
		},
		{
			code: `
      @if true {}
      @else {
      }
    `,
		},
	],

	reject: [
		{
			code: `
      @else {
        color: pink;
      }
      @if true {}
    `,
			fixed: `
      @else {
        color: pink;
      }

      @if true {}
    `,
			message: messages.expected,
			line: 5,
			column: 7,
			fix: { range: [43, 44], text: '\n\n' },
		},
	],
});

testRule({
	ruleName,
	config: ['never', { ignoreAtRules: ['else'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: `
      @if(true) {
      } @else {
      }
    `,
		},
		{
			code: `
      @if(true) {
      }

      @else {
      }
    `,
		},
		{
			code: `
      @if(true) {}

      @else if(true) {}

      @else {}
    `,
		},
	],

	reject: [
		{
			code: `
      @if(true) {
      }

      @else-mixin {}
    `,
			fixed: `
      @if(true) {
      }
      @else-mixin {}
    `,
			message: messages.rejected,
			line: 5,
			column: 7,
			fix: { range: [27, 28], text: '' },
		},
		{
			code: `
      @if (true)
      {}

      @if (false) {
      }
    `,
			fixed: `
      @if (true)
      {}
      @if (false) {
      }
    `,
			message: messages.rejected,
			line: 5,
			column: 7,
			fix: { range: [27, 28], text: '' },
		},
	],
});

testRule({
	ruleName,
	config: ['never', { ignoreAtRules: '/el/' }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: `
      @keyframes {}

      @someelement-mixin();
    `,
		},
		{
			code: `
      @if true {}

      @else {
      }
    `,
		},
	],

	reject: [
		{
			code: `
      @else {
        color: pink;
      }

      @if true {}
    `,
			fixed: `
      @else {
        color: pink;
      }
      @if true {}
    `,
			message: messages.rejected,
			line: 6,
			column: 7,
			fix: { range: [44, 45], text: '' },
		},
	],
});

testRule(
	mergeTestDescriptions(sharedAlwaysTests, {
		ruleName,
		config: [
			'always',
			{
				ignore: ['blockless-after-same-name-blockless'],
			},
		],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: stripIndent`
      @charset "UTF-8";

      @import url(x.css);
      @import url(y.css);`,
			},
			{
				code: stripIndent`
      a {

        @extends .foo;
        @extends .bar;

        @include loop;
        @include doo;
      }`,
			},
			{
				code: stripIndent`
      @charset "UTF-8";

      @import url(x.css); /* comment */
      @import url(y.css);`,
				description: 'shared-line comment accepted',
			},
		],

		reject: [
			{
				code: stripIndent`
      @charset "UTF-8";
      @import url(x.css);
      @import url(y.css);`,
				fixed: stripIndent`
      @charset "UTF-8";

      @import url(x.css);
      @import url(y.css);`,
				message: messages.expected,
				line: 2,
				column: 1,
				fix: { range: [17, 18], text: '\n\n' },
			},
			{
				code: stripIndent`
      a {

        @extends .foo;
        @extends .bar;
        @include loop;
        @include doo;
      }`,
				fixed: stripIndent`
      a {

        @extends .foo;
        @extends .bar;

        @include loop;
        @include doo;
      }`,
				message: messages.expected,
				line: 5,
				column: 3,
				fix: { range: [38, 39], text: '\n\n' },
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedAlwaysTests, {
		ruleName,
		config: [
			'always',
			{
				except: ['blockless-after-same-name-blockless'],
			},
		],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: stripIndent`
      @charset "UTF-8";

      @import url(x.css);
      @import url(y.css);`,
			},
			{
				code: stripIndent`
      a {

        @extends .foo;
        @extends .bar;

        @include loop;
        @include doo;
      }`,
			},
			{
				code: stripIndent`
      @charset "UTF-8";

      @import url(x.css); /* comment */
      @import url(y.css);`,
				description: 'shared-line comment accepted',
			},
		],

		reject: [
			{
				code: stripIndent`
      @charset "UTF-8";
      @import url(x.css);
      @import url(y.css);`,
				fixed: stripIndent`
      @charset "UTF-8";

      @import url(x.css);
      @import url(y.css);`,
				message: messages.expected,
				line: 2,
				column: 1,
				fix: { range: [17, 18], text: '\n\n' },
			},
			{
				code: stripIndent`
      a {

        @extends .foo;
        @extends .bar;
        @include loop;
        @include doo;
      }`,
				fixed: stripIndent`
      a {

        @extends .foo;
        @extends .bar;

        @include loop;
        @include doo;
      }`,
				message: messages.expected,
				line: 5,
				column: 3,
				fix: { range: [38, 39], text: '\n\n' },
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedNeverTests, {
		ruleName,
		config: [
			'never',
			{
				except: ['blockless-after-same-name-blockless'],
			},
		],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: stripIndent`
      @charset "UTF-8";
      @import url(x.css);

      @import url(y.css);`,
			},
			{
				code: stripIndent`
      a {
        @extends .foo;

        @extends .bar;
        @include loop;

        @include doo;
      }`,
			},
		],

		reject: [
			{
				code: stripIndent`
      @charset "UTF-8";
      @import url(x.css);
      @import url(y.css);`,
				fixed: stripIndent`
      @charset "UTF-8";
      @import url(x.css);

      @import url(y.css);`,
				message: messages.expected,
				line: 3,
				column: 1,
				fix: { range: [37, 38], text: '\n\n' },
			},
			{
				code: stripIndent`
      a {
        @extends .bar;
        @include loop;
        @include doo;
      }`,
				fixed: stripIndent`
      a {
        @extends .bar;
        @include loop;

        @include doo;
      }`,
				message: messages.expected,
				line: 4,
				column: 3,
				fix: { range: [37, 38], text: '\n\n' },
			},
		],
	}),
);

testRule({
	ruleName,
	config: [
		'always',
		{
			except: ['after-same-name'],
		},
	],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: stripIndent`
      @charset "UTF-8";

      @include x;
      @include y {}`,
		},
		{
			code: stripIndent`
      a {

        @extends .foo;
        @extends .bar;

        @include y {}
        @include x;
      }`,
		},
	],

	reject: [
		{
			code: stripIndent`
      @charset "UTF-8";
      @include x;
      @include y {}`,
			fixed: stripIndent`
      @charset "UTF-8";

      @include x;
      @include y {}`,
			message: messages.expected,
			line: 2,
			column: 1,
			fix: { range: [17, 18], text: '\n\n' },
		},
		{
			code: stripIndent`
      a {

        @extends .foo;
        @extends .bar;
        @include y {}
        @include x;
      }`,
			fixed: stripIndent`
      a {

        @extends .foo;
        @extends .bar;

        @include y {}
        @include x;
      }`,
			message: messages.expected,
			line: 5,
			column: 3,
			fix: { range: [38, 39], text: '\n\n' },
		},
	],
});

testRule(
	mergeTestDescriptions(sharedNeverTests, {
		ruleName,
		config: [
			'never',
			{
				except: ['after-same-name'],
			},
		],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: stripIndent`
      @charset "UTF-8";
      @include x;

      @include y {}`,
			},
			{
				code: stripIndent`
      a {
        @extends .foo;

        @extends .bar;
        @include y {}

        @include x;
      }`,
			},
		],

		reject: [
			{
				code: stripIndent`
      @charset "UTF-8";
      @include x;
      @include y {}`,
				fixed: stripIndent`
      @charset "UTF-8";
      @include x;

      @include y {}`,
				message: messages.expected,
				line: 3,
				column: 1,
				fix: { range: [29, 30], text: '\n\n' },
			},
			{
				code: stripIndent`
      a {
        @extends .bar;
        @include x;
        @include y {}
      }`,
				fixed: stripIndent`
      a {
        @extends .bar;
        @include x;

        @include y {}
      }`,
				message: messages.expected,
				line: 4,
				column: 3,
				fix: { range: [34, 35], text: '\n\n' },
			},
		],
	}),
);

testRule({
	ruleName,
	customSyntax: 'postcss-less',
	config: ['always'],
	computeEditInfo: true,

	accept: [
		{
			code: `
        .someMixin() { margin: 0; }

        span { .someMixin(); }
      `,
			description: 'ignore Less mixin',
		},
		{
			code: `
        @myVariable: #f7f8f9;

        span { background-color: @myVariable; }
      `,
			description: 'ignore Less variable',
		},
	],
});
