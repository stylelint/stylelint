import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import process from 'node:process';

import redirectModule from '../testUtils/redirectModule.mjs';
import standalone from '../standalone.mjs';

redirectModule(
	new URL('../rules/block-no-empty/index.mjs', import.meta.url).href,
	new URL('./fixtures/rule-deprecated.mjs', import.meta.url),
);

it('standalone does not silence deprecation warnings by default', async (t) => {
	const emitWarning = t.mock.method(process, 'emitWarning', () => {});
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	const { results } = await standalone({ code: 'a { color: #FFF }', config });
	const text = 'The "block-no-empty" rule is deprecated.';

	assert.equal(results[0].deprecations.length, 1);
	assert.equal(results[0].deprecations[0].text, text);
	assert.equal(results[0].warnings.length, 1);
	assert.deepEqual(
		emitWarning.mock.calls.map((call) => call.arguments),
		[
			[
				text,
				{
					code: 'stylelint:006',
					detail:
						'Please be aware that the "block-no-empty" rule will soon be either removed or renamed.',
					type: 'DeprecationWarning',
				},
			],
		],
	);
});

describe('flags', () => {
	it('standalone silences deprecation warnings when passed --quiet-deprecation-warnings', async () => {
		const config = {
			rules: {
				'block-no-empty': true,
			},
		};

		const { results } = await standalone({
			code: 'a { color: #FFF }',
			config,
			quietDeprecationWarnings: true,
		});

		assert.equal(results[0].deprecations.length, 0);
		assert.equal(results[0].warnings.length, 1);
	});

	it('standalone silences deprecation warnings when passed --no-deprecation', async (t) => {
		const { noDeprecation } = process;

		process.noDeprecation = true;
		t.after(() => {
			process.noDeprecation = noDeprecation;
		});

		const config = {
			rules: {
				'block-no-empty': true,
			},
		};

		const { results } = await standalone({
			code: 'a { color: #FFF }',
			config,
		});

		assert.equal(results[0].deprecations.length, 0);
		assert.equal(results[0].warnings.length, 1);
	});
});
