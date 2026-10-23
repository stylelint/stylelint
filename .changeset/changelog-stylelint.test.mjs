// This test sits next to changelog-stylelint.mjs rather than under
// .changeset/__tests__/ because @changesets/read treats every subdirectory of
// .changeset/ as a legacy v1 changeset and fails to read changes.json from it.

import { beforeEach, describe, test } from 'node:test';

import { getCommitInfo } from './get-github-info.mock.mjs';
import redirectModule from '../lib/testUtils/redirectModule.mjs';

redirectModule(
	'@changesets/get-github-info',
	new URL('./get-github-info.mock.mjs', import.meta.url),
);

const { default: changelog } = await import('./changelog-stylelint.mjs');

const REPO = 'stylelint/stylelint-test';
const options = { repo: REPO };

beforeEach(() => {
	getCommitInfo.mock.resetCalls();
	getCommitInfo.mock.mockImplementation(async () => ({
		pull: {
			markdownLink: `[#42](https://github.com/${REPO}/pull/42)`,
		},
		author: {
			markdownLink: '[@octocat](https://github.com/octocat)',
		},
	}));
});

describe('getReleaseLine', () => {
	test('formats valid summary with PR and user when commit present', async (t) => {
		const line = await changelog.getReleaseLine(
			{ summary: 'Fixed: something', commit: 'abc1234' },
			'patch',
			options,
		);

		t.assert.strictEqual(
			line,
			`- Fixed: something ([#42](https://github.com/${REPO}/pull/42)) ([@octocat](https://github.com/octocat)).`,
		);
	});

	test('strips a trailing period from the summary to avoid a doubled period', async (t) => {
		const line = await changelog.getReleaseLine(
			{ summary: 'Fixed: something.', commit: 'abc1234' },
			'patch',
			options,
		);

		t.assert.strictEqual(
			line,
			`- Fixed: something ([#42](https://github.com/${REPO}/pull/42)) ([@octocat](https://github.com/octocat)).`,
		);
	});

	test('omits suffix when no commit', async (t) => {
		const line = await changelog.getReleaseLine({ summary: 'Added: thing' }, 'minor', options);

		t.assert.strictEqual(line, '- Added: thing.');
		t.assert.strictEqual(getCommitInfo.mock.callCount(), 0);
	});

	test('omits suffix when fetched commit info holds empty attributes', async (t) => {
		getCommitInfo.mock.mockImplementation(async () => ({ pull: {}, author: {} }));

		const line = await changelog.getReleaseLine(
			{ summary: 'Added: thing', commit: 'abc1234' },
			'minor',
			options,
		);

		t.assert.strictEqual(line, '- Added: thing.');
	});

	test('accepts a valid prefix', async (t) => {
		const line = await changelog.getReleaseLine({ summary: 'Fixed: thing' }, 'patch', options);

		t.assert.strictEqual(line, '- Fixed: thing.');
	});

	for (const summary of ['', 'bogus', 'fixed: lowercase', 'Fixed:no-space']) {
		test(`rejects ${JSON.stringify(summary)}`, async (t) => {
			await t.assert.rejects(changelog.getReleaseLine({ summary }, 'patch', options), {
				message: `Invalid changeset summary: ${JSON.stringify(summary.trim())}, expected: "<Removed|Changed|Added|Deprecated|Fixed|Security>: <description>"`,
			});
		});
	}

	const accepted = [
		['Removed: x', 'major'],
		['Changed: x', 'major'],
		['Added: x', 'minor'],
		['Deprecated: x', 'minor'],
		['Fixed: x', 'minor'],
		['Fixed: x', 'patch'],
		['Security: x', 'patch'],
	];

	for (const [summary, type] of accepted) {
		test(`accepts ${JSON.stringify(summary)} for ${JSON.stringify(type)} bump`, async (t) => {
			t.assert.match(await changelog.getReleaseLine({ summary }, type, options), /^- /);
		});
	}

	const rejected = [
		['Removed: x', 'minor', 'Added|Deprecated|Fixed'],
		['Removed: x', 'patch', 'Fixed|Security'],
		['Changed: x', 'minor', 'Added|Deprecated|Fixed'],
		['Changed: x', 'patch', 'Fixed|Security'],
		['Added: x', 'major', 'Removed|Changed'],
		['Added: x', 'patch', 'Fixed|Security'],
		['Deprecated: x', 'major', 'Removed|Changed'],
		['Deprecated: x', 'patch', 'Fixed|Security'],
		['Fixed: x', 'major', 'Removed|Changed'],
		['Security: x', 'major', 'Removed|Changed'],
		['Security: x', 'minor', 'Added|Deprecated|Fixed'],
	];

	for (const [summary, type, allowed] of rejected) {
		test(`rejects ${JSON.stringify(summary)} for ${JSON.stringify(type)} bump`, async (t) => {
			const [prefix] = summary.split(':');

			await t.assert.rejects(changelog.getReleaseLine({ summary }, type, options), {
				message: `Invalid changeset: "${prefix}" prefix not allowed for "${type}" bump, expected: "${allowed}"`,
			});
		});
	}

	test('throws with an invalid "repo" option', async (t) => {
		const changeset = { summary: 'Fixed: x' };
		const msg = '"repo" option is required and must be a string';

		await t.assert.rejects(changelog.getReleaseLine(changeset, 'patch', {}), { message: msg });
		await t.assert.rejects(changelog.getReleaseLine(changeset, 'patch', { repo: 0 }), {
			message: msg,
		});
	});
});
