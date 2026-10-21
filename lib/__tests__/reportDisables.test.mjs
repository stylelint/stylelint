import { describe, it } from 'node:test';

import assertItemsPartialDeepStrictEqual from '../testUtils/assertItemsPartialDeepStrictEqual.mjs';
import standalone from '../standalone.mjs';
import stripIndent from '../testUtils/stripIndent.mjs';

describe('reportDisables', () => {
	it('reports a disabled comment', async (t) => {
		const config = {
			rules: { 'block-no-empty': [true, { reportDisables: true }] },
		};

		const css = stripIndent`
    /* stylelint-disable block-no-empty */
    a {}
    /* stylelint-enable block-no-empty */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    `;

		const { results } = await standalone({ config, code: css });

		t.assert.strictEqual(results.length, 1);
		assertItemsPartialDeepStrictEqual(results[0].warnings, [
			{
				line: 1,
				column: 1,
				endLine: 1,
				endColumn: 38,
				text: 'Rule "block-no-empty" may not be disabled',
				rule: 'reportDisables',
				severity: 'error',
			},
			{
				line: 5,
				column: 8,
				endLine: 5,
				endColumn: 50,
				text: 'Rule "block-no-empty" may not be disabled',
				rule: 'reportDisables',
				severity: 'error',
			},
		]);
		t.assert.strictEqual(results[0].errored, true);
	});

	it('reports an ignored disabled comment', async (t) => {
		const config = {
			rules: { 'block-no-empty': [true, { reportDisables: true }] },
		};

		const css = stripIndent`
    /* stylelint-disable block-no-empty */
    a {}
    /* stylelint-enable block-no-empty */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    `;

		const { results } = await standalone({
			config,
			code: css,
			ignoreDisables: true,
		});

		t.assert.strictEqual(results.length, 1);
		assertItemsPartialDeepStrictEqual(
			results[0].warnings.filter((warning) => warning.rule === 'reportDisables'),
			[
				{
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 38,
					text: 'Rule "block-no-empty" may not be disabled',
					rule: 'reportDisables',
					severity: 'error',
				},
				{
					line: 5,
					column: 8,
					endLine: 5,
					endColumn: 50,
					text: 'Rule "block-no-empty" may not be disabled',
					rule: 'reportDisables',
					severity: 'error',
				},
			],
		);
	});

	it("doesn't report disables by default", async (t) => {
		const config = {
			rules: { 'block-no-empty': [true] },
		};

		const css = stripIndent`
    /* stylelint-disable block-no-empty */
    a {}
    /* stylelint-enable block-no-empty */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    `;

		const { results } = await standalone({ config, code: css });

		t.assert.strictEqual(results.length, 1);
		t.assert.strictEqual(results[0].warnings.length, 0);
	});

	it("doesn't report unscoped disables", async (t) => {
		const config = {
			rules: { 'block-no-empty': [true, { reportDisables: true }] },
		};

		const css = stripIndent`
    a {} /* stylelint-disable-line */
    `;

		const { results } = await standalone({ config, code: css });

		t.assert.strictEqual(results.length, 1);
		t.assert.strictEqual(results[0].warnings.length, 0);
	});
});
