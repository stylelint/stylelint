import { it } from 'node:test';

import nodeContextLookup from '../nodeContextLookup.mjs';

import { fileURLToPath } from 'node:url';

import postcss from 'postcss';
import postcssImport from 'postcss-import';

it('nodeContextLookup checking media context', async (t) => {
	const testLookup = nodeContextLookup();

	const result = await postcss([postcssImport()]).process(
		"@import 'fixtures/one.css'; @import 'fixtures/two.css';",
		{
			from: fileURLToPath(new URL('./fake.css', import.meta.url)),
		},
	);

	const rulesBySelector = {};

	result.root.walkRules((rule) => {
		rulesBySelector[rule.selector] = rule;
	});

	t.assert.deepStrictEqual(Object.keys(rulesBySelector), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);

	// a-d are in one file; e-h in another
	t.assert.strictEqual(
		testLookup.getContext(rulesBySelector.a, rulesBySelector.a.parent),
		testLookup.getContext(rulesBySelector.b, rulesBySelector.b.parent),
	);

	t.assert.notStrictEqual(
		testLookup.getContext(rulesBySelector.a, rulesBySelector.a.parent),
		testLookup.getContext(rulesBySelector.c, rulesBySelector.c.parent),
	);

	t.assert.notStrictEqual(
		testLookup.getContext(rulesBySelector.a, rulesBySelector.a.parent),
		testLookup.getContext(rulesBySelector.e, rulesBySelector.e.parent),
	);

	t.assert.strictEqual(
		testLookup.getContext(rulesBySelector.c, rulesBySelector.c.parent),
		testLookup.getContext(rulesBySelector.d, rulesBySelector.d.parent),
	);

	t.assert.notStrictEqual(
		testLookup.getContext(rulesBySelector.c, rulesBySelector.c.parent),
		testLookup.getContext(rulesBySelector.g, rulesBySelector.g.parent),
	);

	t.assert.strictEqual(
		testLookup.getContext(rulesBySelector.e, rulesBySelector.e.parent),
		testLookup.getContext(rulesBySelector.f, rulesBySelector.f.parent),
	);

	t.assert.notStrictEqual(
		testLookup.getContext(rulesBySelector.f, rulesBySelector.f.parent),
		testLookup.getContext(rulesBySelector.g, rulesBySelector.g.parent),
	);

	t.assert.strictEqual(
		testLookup.getContext(rulesBySelector.g, rulesBySelector.g.parent),
		testLookup.getContext(rulesBySelector.h, rulesBySelector.h.parent),
	);
});
