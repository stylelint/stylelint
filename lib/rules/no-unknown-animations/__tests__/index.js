'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@keyframes foo {} a { animation-name: foo; }',
			description: 'keyframes before usage',
		},
		{
			code: 'a { animation-name: none; }',
			description: 'ignore none',
		},
		{
			code: 'a { animation-name: NONE; }',
			description: 'ignore NONE',
		},
		{
			code: 'a { animation-name: initial; }',
			description: 'ignore initial',
		},
		{
			code: 'a { animation-name: INITIAL; }',
			description: 'ignore INITIAL',
		},
		{
			code: 'a { animation-name: inherit; }',
			description: 'ignore inherit',
		},
		{
			code: 'a { animation-name: unset; }',
			description: 'ignore unset',
		},
		{
			code: 'a { animation-name: foo; } @keyframes foo {}',
			description: 'keyframes after usage',
		},
		{
			code: 'a { animation: none; }',
			description: 'ignore none in longhand',
		},
		{
			code: 'a { animation: NONE; }',
			description: 'ignore NONE in longhand',
		},
		{
			code: 'a { animation: 2s linear 0s infinite alternate none; }',
			description: 'ignore none in longhand',
		},
		{
			code: 'a { animation: initial; }',
			description: 'ignore initial in longhand',
		},
		{
			code: 'a { animation: INITIAL; }',
			description: 'ignore INITIAL in longhand',
		},
		{
			code: 'a { animation: 2s linear 0s infinite alternate initial; }',
			description: 'ignore initial in longhand',
		},
		{
			code: 'a { animation: inherit; }',
			description: 'ignore inherit in longhand',
		},
		{
			code: 'a { animation: 2s linear 0s infinite alternate inherit; }',
			description: 'ignore inherit in longhand',
		},
		{
			code: 'a { animation: unset; }',
			description: 'ignore unset in longhand',
		},
		{
			code: 'a { animation: 2s linear 0s infinite alternate unset; }',
			description: 'ignore unset in longhand',
		},
		{
			code: '@keyframes foo {} a { animation: foo 2s linear; }',
			description: 'animation shorthand',
		},
		{
			code: '@-webkit-keyframes foo {} a { animation: foo 2s linear; }',
			description: 'vendor keyframe at-rule',
		},
		{
			code: '@keyframes foo {} a { animation: foo 1s ease 0.2s 1 both; }',
			description: 'animation shorthand',
		},
		{
			code: '@kEyFrAmEs foo {} a { animation: foo 2s linear; }',
			description: 'animation shorthand',
		},
		{
			code: '@KEYFRAMES foo {} a { animation: foo 2s linear; }',
			description: 'animation shorthand',
		},
		{
			code: '@keyframes foo {} a { animation: linear foo 2s backwards; }',
			description: 'animation shorthand variant',
		},
		{
			code: '@keyframes foo {} a { animation: $sassy-variable 2s linear; }',
			description: 'ignores sass variable in shorthand',
		},
		{
			code: '@keyframes foo {} a { animation: var(--custom-property) 2s linear; }',
			description: 'ignores custom property in shorthand',
		},
		{
			code: '@keyframes foo {} a { animation: linear 2s @lessy-lessy; }',
			description: 'ignores less variable in shorthand',
		},
		{
			code: '@keyframes foo {} a { animation: steps(12, end) 2s foo; }',
			description: 'ignores steps() function',
		},
		{
			code: '@keyframes foo {} a { animation: foo 100ms cubic-bezier(0.1, 0.7, 1.0, 0.1); }',
			description: 'ignores cubic-bezier() function',
		},
		{
			code: '@keyframes fOo {} a { animation: fOo 100Ms CuBiC-bEzIeR(0.1, 0.7, 1.0, 0.1); }',
			description: 'ignores CuBiC-bEzIeR() function',
		},
		{
			code: '@keyframes FOO {} a { animation: FOO 100MS CUBIC-BEZIER(0.1, 0.7, 1.0, 0.1); }',
			description: 'ignores CUBIC-BEZIER() function',
		},
		{
			code: '@keyframes foo {} a { animation: foo .1s ease .2s 1 both; }',
			description: 'animation shorthand',
		},
		{
			code: '@keyframes foo {} @keyframes bar {} a { animation-name: foo, bar; }',
			description: 'multiple animation names',
		},
		{
			code: '@keyframes foo {} a { animation-name: none, foo; }',
			description: 'multiple animation names and keyword none',
		},
	],

	reject: [
		{
			code: 'a { animation-name: foo; }',
			description: 'no declaration',
			message: messages.rejected('foo'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { aNiMaTiOn-NaMe: foo; }',
			description: 'no declaration',
			message: messages.rejected('foo'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { ANIMATION-NAME: foo; }',
			description: 'no declaration',
			message: messages.rejected('foo'),
			line: 1,
			column: 21,
		},
		{
			code: '@keyframes bar {} .baz { animation-name: foo; }',
			description: 'no matching declaration with animation-name',
			message: messages.rejected('foo'),
			line: 1,
			column: 42,
		},
		{
			code: '@-webkit-keyframes bar {} .baz { animation-name: foo; }',
			description: 'no matching declaration with animation-name',
			message: messages.rejected('foo'),
			line: 1,
			column: 50,
		},
		{
			code: '@kEyFrAmEs bar {} .baz { animation-name: foo; }',
			description: 'no matching declaration with animation-name',
			message: messages.rejected('foo'),
			line: 1,
			column: 42,
		},
		{
			code: '@KEYFRAMES bar {} .baz { animation-name: foo; }',
			description: 'no matching declaration with animation-name',
			message: messages.rejected('foo'),
			line: 1,
			column: 42,
		},
		{
			code: 'a { animation: baz 100ms ease-in backwards; } @keyframes bar {}',
			description: 'no matching declaration with animation shorthand',
			message: messages.rejected('baz'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { animation: bAz 100Ms EaSe-In BaCkWaRdS; } @keyframes bAr {}',
			description: 'no matching declaration with animation shorthand',
			message: messages.rejected('bAz'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { animation: BAZ 100MS EASE-IN BACKWARDS; } @keyframes BAR {}',
			description: 'no matching declaration with animation shorthand',
			message: messages.rejected('BAZ'),
			line: 1,
			column: 16,
		},
		{
			code: '@keyframes foo {} a { animation-name: foo, bar; }',
			description: 'multiple animation names',
			message: messages.rejected('bar'),
			line: 1,
			column: 44,
		},
		{
			code: '@keyframes foo {} a { animation-name: none, bar; }',
			description: 'multiple animation names',
			message: messages.rejected('bar'),
			line: 1,
			column: 45,
		},
	],
});
