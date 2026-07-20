// This test sits next to changelog-stylelint.mjs rather than under
// .changeset/__tests__/ because @changesets/read treats every subdirectory of
// .changeset/ as a legacy v1 changeset and fails to read changes.json from it.

import { jest } from '@jest/globals';

const getInfo = jest.fn();

jest.unstable_mockModule('@changesets/get-github-info', () => ({ getInfo }));

const { default: changelog } = await import('./changelog-stylelint.mjs');

const REPO = 'stylelint/stylelint-test';
const options = { repo: REPO };

beforeEach(() => {
	getInfo.mockReset();
	getInfo.mockResolvedValue({
		links: {
			commit: `[\`abc1234\`](https://github.com/${REPO}/commit/abc1234)`,
			pull: `[#42](https://github.com/${REPO}/pull/42)`,
			user: '[@octocat](https://github.com/octocat)',
		},
	});
});

describe('getReleaseLine', () => {
	test('formats valid summary with PR and user when commit present', async () => {
		const line = await changelog.getReleaseLine(
			{ summary: 'Fixed: something', commit: 'abc1234' },
			'patch',
			options,
		);

		expect(line).toBe(
			`- Fixed: something ([#42](https://github.com/${REPO}/pull/42)) ([@octocat](https://github.com/octocat)).`,
		);
	});

	test('strips a trailing period from the summary to avoid a doubled period', async () => {
		const line = await changelog.getReleaseLine(
			{ summary: 'Fixed: something.', commit: 'abc1234' },
			'patch',
			options,
		);

		expect(line).toBe(
			`- Fixed: something ([#42](https://github.com/${REPO}/pull/42)) ([@octocat](https://github.com/octocat)).`,
		);
	});

	test('omits suffix when no commit', async () => {
		const line = await changelog.getReleaseLine({ summary: 'Added: thing' }, 'minor', options);

		expect(line).toBe('- Added: thing.');
		expect(getInfo).not.toHaveBeenCalled();
	});

	test('accepts a valid prefix', async () => {
		const line = await changelog.getReleaseLine({ summary: 'Fixed: thing' }, 'patch', options);

		expect(line).toBe('- Fixed: thing.');
	});

	test.each(['', 'bogus', 'fixed: lowercase', 'Fixed:no-space'])('rejects %p', async (summary) => {
		await expect(changelog.getReleaseLine({ summary }, 'patch', options)).rejects.toThrow(
			`Invalid changeset summary: ${JSON.stringify(summary.trim())}, expected: "<Removed|Changed|Added|Deprecated|Fixed|Security>: <description>"`,
		);
	});

	test.each([
		['Removed: x', 'major'],
		['Changed: x', 'major'],
		['Added: x', 'minor'],
		['Deprecated: x', 'minor'],
		['Fixed: x', 'minor'],
		['Fixed: x', 'patch'],
		['Security: x', 'patch'],
	])('accepts %p for %p bump', async (summary, type) => {
		await expect(changelog.getReleaseLine({ summary }, type, options)).resolves.toMatch(/^- /);
	});

	test.each([
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
	])('rejects %p for %p bump', async (summary, type, allowed) => {
		const [prefix] = summary.split(':');

		await expect(changelog.getReleaseLine({ summary }, type, options)).rejects.toThrow(
			`Invalid changeset: "${prefix}" prefix not allowed for "${type}" bump, expected: "${allowed}"`,
		);
	});

	test('throws without repo option', async () => {
		await expect(changelog.getReleaseLine({ summary: 'Fixed: x' }, 'patch', {})).rejects.toThrow(
			'"repo" option is required',
		);
	});
});
