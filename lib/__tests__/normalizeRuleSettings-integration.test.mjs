import { fileURLToPath } from 'node:url';
import { it } from 'node:test';
import path from 'node:path';

import standalone from '../standalone.mjs';

const fixture = (...elem) =>
	path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elem);

it('[normalized rule settings] primary option array', async (t) => {
	const { results } = await standalone({
		code: 'a:focus {}',
		config: {
			rules: {
				'selector-pseudo-class-disallowed-list': ['focus'],
			},
		},
	});

	t.assert.strictEqual(results[0].warnings[0].rule, 'selector-pseudo-class-disallowed-list');
});

it('[normalized rule settings] primary option array in array', async (t) => {
	const { results } = await standalone({
		code: 'a:focus {}',
		config: {
			rules: {
				'selector-pseudo-class-disallowed-list': [['focus']],
			},
		},
	});

	t.assert.strictEqual(results[0].warnings[0].rule, 'selector-pseudo-class-disallowed-list');
});

it('[normalized rule settings] no-array primary, primary option null', async (t) => {
	const { results } = await standalone({
		code: 'a:focus {}',
		config: {
			extends: [fixture('config-block-no-empty.json')],
			rules: {
				'block-no-empty': null,
			},
		},
	});

	t.assert.strictEqual(results[0].warnings.length, 0);
});

it('[normalized rule settings] no-array primary, primary option null in array', async (t) => {
	const { results } = await standalone({
		code: 'a:focus {}',
		config: {
			extends: [fixture('config-block-no-empty.json')],
			rules: {
				'block-no-empty': [null],
			},
		},
	});

	t.assert.strictEqual(results[0].warnings.length, 0);
});

it('[normalized rule settings] array primary, primary option null', async (t) => {
	const { results } = await standalone({
		code: 'a { top: 10px; }',
		config: {
			extends: [fixture('config-no-pixels.json')],
			rules: {
				'unit-disallowed-list': null,
			},
		},
	});

	t.assert.strictEqual(results[0].warnings.length, 0);
});

it('[normalized rule settings] array primary, primary option null in array', async (t) => {
	const { results } = await standalone({
		code: 'a { top: 10px; }',
		config: {
			extends: [fixture('config-no-pixels.json')],
			rules: {
				'unit-disallowed-list': [null],
			},
		},
	});

	t.assert.strictEqual(results[0].invalidOptionWarnings.length, 0);
});
