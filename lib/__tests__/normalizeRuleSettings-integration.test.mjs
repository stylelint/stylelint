import { fileURLToPath } from 'node:url';
import path from 'node:path';

import standalone from '../standalone.js';

const fixture = (...elem) =>
	path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elem);

it('[normalized rule settings] primary option array', async () => {
	const { results } = await standalone({
		code: 'a:focus {}',
		config: {
			rules: {
				'selector-pseudo-class-disallowed-list': ['focus'],
			},
		},
	});

	expect(results[0].warnings[0].rule).toBe('selector-pseudo-class-disallowed-list');
});

it('[normalized rule settings] primary option array in array', async () => {
	const { results } = await standalone({
		code: 'a:focus {}',
		config: {
			rules: {
				'selector-pseudo-class-disallowed-list': [['focus']],
			},
		},
	});

	expect(results[0].warnings[0].rule).toBe('selector-pseudo-class-disallowed-list');
});

it('[normalized rule settings] no-array primary, primary option null', async () => {
	const { results } = await standalone({
		code: 'a:focus {}',
		config: {
			extends: [fixture('config-block-no-empty.json')],
			rules: {
				'block-no-empty': null,
			},
		},
	});

	expect(results[0].warnings).toHaveLength(0);
});

it('[normalized rule settings] no-array primary, primary option null in array', async () => {
	const { results } = await standalone({
		code: 'a:focus {}',
		config: {
			extends: [fixture('config-block-no-empty.json')],
			rules: {
				'block-no-empty': [null],
			},
		},
	});

	expect(results[0].warnings).toHaveLength(0);
});

it('[normalized rule settings] array primary, primary option null', async () => {
	const { results } = await standalone({
		code: 'a { top: 10px; }',
		config: {
			extends: [fixture('config-no-pixels.json')],
			rules: {
				'unit-disallowed-list': null,
			},
		},
	});

	expect(results[0].warnings).toHaveLength(0);
});

it('[normalized rule settings] array primary, primary option null in array', async () => {
	const { results } = await standalone({
		code: 'a { top: 10px; }',
		config: {
			extends: [fixture('config-no-pixels.json')],
			rules: {
				'unit-disallowed-list': [null],
			},
		},
	});

	expect(results[0].invalidOptionWarnings).toHaveLength(0);
});
