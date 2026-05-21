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
			/Invalid changeset summary/,
		);
	});

	test('throws without repo option', async () => {
		await expect(changelog.getReleaseLine({ summary: 'Fixed: x' }, 'patch', {})).rejects.toThrow(
			'"repo" option is required',
		);
	});
});
