import rule from '../index.mjs';
const { messages, ruleName } = rule;

const MIN_VALUE = 100;

testRule({
	ruleName,
	config: [MIN_VALUE],

	accept: [
		{
			code: 'a { animation: none; }',
		},
		{
			code: 'a { animation: none, my-animation; }',
		},
		{
			code: 'a { transition: opacity var(--x) var(--y) ease-out }',
		},
		{
			code: 'a { transition-delay: 0.1s; }',
		},
		{
			code: 'a { transition-delay: 0.2s; }',
		},
		{
			code: 'a { -webkit-transition-delay: 0.2s; }',
		},
		{
			code: 'a { tRaNsItIoN-dElAy: 0.2s; }',
		},
		{
			code: 'a { TRANSITION-DELAY: 0.2s; }',
		},
		{
			code: 'a { transition-delay: 3s; }',
		},
		{
			code: 'a { transition-delay: 100ms; }',
		},
		{
			code: 'a { transition-delay: 200ms; }',
		},
		{
			code: 'a { transition-delay: 5000ms; }',
		},
		{
			code: 'a { transition-duration: 0.15s; }',
		},
		{
			code: 'a { -webkit-transition-duration: 0.15s; }',
		},
		{
			code: 'a { transition-duration: 2.8s; }',
		},
		{
			code: 'a { transition-duration: 330ms; }',
		},
		{
			code: 'a { transition-duration: 4700ms; }',
		},
		{
			code: 'a { transition: foo 0.8s linear; }',
		},
		{
			code: 'a { -webkit-transition: foo 0.8s linear; }',
		},
		{
			code: 'a { tRaNsItIoN: foo 0.8s linear; }',
		},
		{
			code: 'a { TRANSITION: foo 0.8s linear; }',
		},
		{
			code: 'a { transition: foo 0.8s ease-in-out 200ms; }',
		},
		{
			code: 'a { transition: foo 0.8s, bar 0.8s; }',
		},
		{
			code: 'a { animation-delay: 0.2s; }',
		},
		{
			code: 'a { -webkit-animation-delay: 0.2s; }',
		},
		{
			code: 'a { animation-delay: 3s; }',
		},
		{
			code: 'a { animation-delay: 200ms; }',
		},
		{
			code: 'a { animation-delay: 5000ms; }',
		},
		{
			code: 'a { animation-duration: 0.15s; }',
		},
		{
			code: 'a { -webkit-animation-duration: 0.15s; }',
		},
		{
			code: 'a { animation-duration: 2.8s; }',
		},
		{
			code: 'a { animation-duration: 330ms; }',
		},
		{
			code: 'a { animation-duration: 4700ms; }',
		},
		{
			code: 'a { animation: foo 0.8s linear; }',
		},
		{
			code: 'a { -webkit-animation: foo 0.8s linear; }',
		},
		{
			code: 'a { animation: foo 0.8s ease-in-out 200ms; }',
		},
		{
			code: 'a { animation: foo 0.8s, bar 0.8s; }',
		},
		{
			description: 'negative values should be ignored',
			code: 'a { animation-delay: -2.5s; }',
		},
		{
			description: 'negative values should be ignored',
			code: 'a { animation-delay: -150ms; }',
		},
		{
			description: 'negative values should be ignored',
			code: 'a { animation-delay: -20ms; }',
		},
		{
			description: 'this test should fail',
			code: 'a { animation: foo 0.8s ease-in-out -20ms; }',
		},
		{
			description: '0ms is acceptable',
			code: 'a { animation-delay: 0ms; }',
		},
		{
			description: '0 is acceptable',
			code: 'a { animation-delay: 0; }',
		},
	],

	reject: [
		{
			code: 'a { transition-delay: 0.006s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { -webkit-transition-delay: 0.006s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: 'a { tRaNsItIoN-dElAy: 0.006s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { TRANSITION-DELAY: 0.006s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { transition-delay: 0.006S; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { transition-delay: 3ms; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { transition-delay: 3MS; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { transition-duration: 0.009s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { -webkit-transition-duration: 0.009s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 34,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: 'a { transition-duration: 80ms; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { transition: foo 0.008s linear; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { -webkit-transition: foo 0.008s linear; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: 'a { tRaNsItIoN: foo 0.008s linear; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { TRANSITION: foo 0.008s linear; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { transition: foo 0.8s ease-in-out 20ms; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 38,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: 'a { transition: foo 0.8s ease 200ms, bar 0.8s ease 20ms; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 52,
			endLine: 1,
			endColumn: 56,
		},
		{
			code: 'a { transition: foo 0.8s ease, bar 30ms ease; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: 'a { animation-delay: 0.006s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { -webkit-animation-delay: 0.006s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: 'a { animation-delay: 3ms; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { animation-duration: 0.009s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { -webkit-animation-duration: 0.009s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 33,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: 'a { animation-duration: 80ms; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { animation: foo 0.008s linear; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { -webkit-animation: foo 0.008s linear; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { animation: foo 0.8s ease-in-out 20ms; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 37,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: 'a { animation: foo 0.8s ease, bar 20ms ease; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: 'a { animation: foo 0.8s ease 0.1s, bar 0.8s ease 0.01s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 50,
			endLine: 1,
			endColumn: 55,
		},
		{
			code: 'a { animation: foo 0.01s ease 0.8s, bar 0.8s ease 0.01s; }',
			warnings: [
				{
					message: messages.expected(MIN_VALUE),
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 25,
				},
				{
					message: messages.expected(MIN_VALUE),
					line: 1,
					column: 51,
					endLine: 1,
					endColumn: 56,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [MIN_VALUE, { ignore: ['delay'] }],

	accept: [
		{
			code: 'a { animation: none; }',
		},
		{
			code: 'a { animation: none, my-animation; }',
		},
		{
			code: 'a { transition: opacity var(--x) var(--y) ease-out }',
		},
		{
			code: 'a { transition-duration: 0.15s; }',
		},
		{
			code: 'a { -webkit-transition-duration: 0.15s; }',
		},
		{
			description: 'transition delay should be ignored',
			code: 'a { transition-delay: 0.006s; }',
		},
		{
			description: 'transition delay should be ignored',
			code: 'a { -webkit-transition-delay: 0.006s; }',
		},
		{
			description: 'transition delay should be ignored',
			code: 'a { transition-delay: 0.1s; }',
		},
		{
			description: 'transition delay should be ignored',
			code: 'a { -webkit-transition-delay: 0.2s; }',
		},
		{
			description: 'transition delay should be ignored',
			code: 'a { TRANSITION-DELAY: 0.2s; }',
		},
		{
			description: 'transition delay should be ignored',
			code: 'a { TRANSITION-DELAY: 0.006s; }',
		},
		{
			code: 'a { transition: foo 0.8s linear; }',
		},
		{
			code: 'a { -webkit-transition: foo 0.8s linear; }',
		},
		{
			code: 'a { animation-duration: 0.15s; }',
		},
		{
			code: 'a { -webkit-animation-duration: 0.15s; }',
		},
		{
			description: 'animation delay should be ignored',
			code: 'a { animation-delay: 0.2s; }',
		},
		{
			description: 'animation delay should be ignored',
			code: 'a { -webkit-animation-delay: 0.2s; }',
		},
		{
			description: 'animation delay should be ignored',
			code: 'a { animation-delay: 200ms; }',
		},
		{
			description: 'animation delay should be ignored',
			code: 'a { animation-delay: 0.006s; }',
		},
		{
			description: 'animation delay should be ignored',
			code: 'a { -webkit-animation-delay: 0.006s; }',
		},
		{
			description: 'animation delay should be ignored',
			code: 'a { animation: foo 0.8s ease 0.2s, bar 0.7s ease 0.2s; }',
		},
		{
			description: 'animation delay should be ignored',
			code: 'a { animation: foo 0.8s ease 0.2s, bar 0.7s ease 20ms; }',
		},
	],

	reject: [
		{
			code: 'a { transition-duration: 0.009s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { -webkit-transition-duration: 0.009s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 34,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: 'a { transition-duration: 80ms; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { transition: foo 0.008s linear; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { -webkit-transition: foo 0.008s linear; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: 'a { animation-duration: 0.009s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { -webkit-animation-duration: 0.009s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 33,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: 'a { animation-duration: 80ms; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { animation: foo 0.8s ease 0.2s, bar 20ms ease 0.2s; }',
			message: messages.expected(MIN_VALUE),
			line: 1,
			column: 40,
			endLine: 1,
			endColumn: 44,
		},
		{
			code: 'a { animation: foo 0.01s ease 0.8s, bar 20ms ease 0.01s; }',
			warnings: [
				{
					message: messages.expected(MIN_VALUE),
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 25,
				},
				{
					message: messages.expected(MIN_VALUE),
					line: 1,
					column: 41,
					endLine: 1,
					endColumn: 45,
				},
			],
		},
	],
});
