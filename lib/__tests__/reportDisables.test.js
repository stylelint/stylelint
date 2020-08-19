'use strict';

const standalone = require('../standalone');
const stripIndent = require('common-tags').stripIndent;

describe('reportDisables', () => {
	it('reports a disabled comment', () => {
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

		return standalone({ config, code: css }).then((linted) => {
			const report = linted.reportedDisables;

			expect(report).toHaveLength(1);
			expect(report[0].ranges).toEqual([
				{ start: 1, end: 3, rule: 'block-no-empty', unusedRule: 'block-no-empty' },
				{ start: 5, end: 5, rule: 'block-no-empty', unusedRule: 'block-no-empty' },
			]);

			// Although these disables are reported as issues, they're still in effect
			// so the underlying lint issues are not reported.
			expect(linted.results[0].warnings).toHaveLength(0);
		});
	});

	it('reports an ignored disabled comment', () => {
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

		return standalone({
			config,
			code: css,
			ignoreDisables: true,
		}).then((linted) => {
			const report = linted.reportedDisables;

			expect(report).toHaveLength(1);
			expect(report[0].ranges).toEqual([
				{ start: 1, end: 3, rule: 'block-no-empty', unusedRule: 'block-no-empty' },
				{ start: 5, end: 5, rule: 'block-no-empty', unusedRule: 'block-no-empty' },
			]);

			expect(linted.results[0].warnings).toHaveLength(2);
		});
	});

	it("doesn't report disables by default", () => {
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

		return standalone({ config, code: css }).then((linted) => {
			const report = linted.reportedDisables;

			expect(report).toHaveLength(0);
		});
	});

	// This should be handled by the global `reportUnscopedDisables` option (#2292).
	it("doesn't report unscoped disables", () => {
		const config = {
			rules: { 'block-no-empty': [true, { reportDisables: true }] },
		};

		const css = stripIndent`
    a {} /* stylelint-disable-line */
    `;

		return standalone({ config, code: css }).then((linted) => {
			const report = linted.reportedDisables;

			expect(report).toHaveLength(1);
			expect(report[0].ranges).toHaveLength(0);
		});
	});
});
