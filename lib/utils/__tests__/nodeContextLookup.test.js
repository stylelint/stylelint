'use strict';

const nodeContextLookup = require('../nodeContextLookup');
const path = require('path');
const postcss = require('postcss');
const postcssImport = require('postcss-import');

it('nodeContextLookup checking media context', () => {
	const testLookup = nodeContextLookup();

	return postcss([postcssImport()])
		.process("@import 'fixtures/one.css'; @import 'fixtures/two.css';", {
			from: path.join(__dirname, 'fake.css'),
		})
		.then((result) => {
			const rulesBySelector = {};

			result.root.walkRules((rule) => {
				rulesBySelector[rule.selector] = rule;
			});

			// a-d are in one file; e-h in another
			expect(testLookup.getContext(rulesBySelector.a, rulesBySelector.a.parent)).toBe(
				testLookup.getContext(rulesBySelector.b, rulesBySelector.b.parent),
			);

			expect(testLookup.getContext(rulesBySelector.a, rulesBySelector.a.parent)).not.toBe(
				testLookup.getContext(rulesBySelector.c, rulesBySelector.c.parent),
			);

			expect(testLookup.getContext(rulesBySelector.a, rulesBySelector.a.parent)).not.toBe(
				testLookup.getContext(rulesBySelector.e, rulesBySelector.e.parent),
			);

			expect(testLookup.getContext(rulesBySelector.c, rulesBySelector.c.parent)).toBe(
				testLookup.getContext(rulesBySelector.d, rulesBySelector.d.parent),
			);

			expect(testLookup.getContext(rulesBySelector.c, rulesBySelector.c.parent)).not.toBe(
				testLookup.getContext(rulesBySelector.g, rulesBySelector.g.parent),
			);

			expect(testLookup.getContext(rulesBySelector.e, rulesBySelector.e.parent)).toBe(
				testLookup.getContext(rulesBySelector.f, rulesBySelector.f.parent),
			);

			expect(testLookup.getContext(rulesBySelector.f, rulesBySelector.f.parent)).not.toBe(
				testLookup.getContext(rulesBySelector.g, rulesBySelector.g.parent),
			);

			expect(testLookup.getContext(rulesBySelector.g, rulesBySelector.g.parent)).toBe(
				testLookup.getContext(rulesBySelector.h, rulesBySelector.h.parent),
			);
		})
		.catch((err) => console.log(err.stack)); // eslint-disable-line no-console
});
