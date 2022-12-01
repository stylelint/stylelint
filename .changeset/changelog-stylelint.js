// @ts-check

// based on https://github.com/changesets/changesets/blob/main/packages/changelog-github/src/index.ts

const { getInfo, getInfoFromPullRequest } = require('@changesets/get-github-info');

/**
 * @type {Array<string | undefined>}
 */
const CHANGESET_SECTIONS = ['Removed', 'Changed', 'Deprecated', 'Added', 'Fixed'];

const changesetSectionReg = new RegExp(`^- (${CHANGESET_SECTIONS.join('|')}): `);

/**
 * @typedef { 'major' | 'minor' | 'patch' } ReleaseType
 * @typedef { Record<ReleaseType, Array<Promise<string>>> } ReleaseLines
 * @typedef { Record<ReleaseType, string[]> | string[] } ResolvedReleaseLines
 * @type {import('@changesets/types').ChangelogFunctions & { reorderReleaseLines(releaseLines: ReleaseLines): Promise<ResolvedReleaseLines> }}
 */
const changelogFunctions = {
	async reorderReleaseLines(releaseLines) {
		const resolved = {
			major: await Promise.all(releaseLines.major),
			minor: await Promise.all(releaseLines.minor),
			patch: await Promise.all(releaseLines.patch),
		};

		return Object.entries(resolved)
			.reduce((acc, [_type, lines]) => {
				const type = /**  @type {ReleaseType} */ (_type);

				lines.forEach((line) => {
					if (line) {
						acc.push(`${line}${type === 'major' ? ' (BREAKING)' : ''}`);
					}
				});

				return acc;
			}, /**  @type {string[]} */ ([]))
			.sort((a, b) => {
				const aSection = changesetSectionReg.exec(a)?.[1];
				const bSection = changesetSectionReg.exec(b)?.[1];

				return aSection === bSection
					? a.localeCompare(b)
					: CHANGESET_SECTIONS.indexOf(aSection) - CHANGESET_SECTIONS.indexOf(bSection);
			});
	},
	async getReleaseLine(changeset, _type, options) {
		if (!options || !options.repo) {
			throw new Error(
				'Please provide a repo to this changelog generator like this:\n"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]',
			);
		}

		/**
		 * @type {number | undefined}
		 */
		let prFromSummary;
		/**
		 * @type {string | undefined}
		 */
		let commitFromSummary;
		/**
		 * @type {string[]}
		 */
		let usersFromSummary = [];

		const replacedChangelog = changeset.summary
			.replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
				let num = Number(pr);

				if (!isNaN(num)) prFromSummary = num;

				return '';
			})
			.replace(/^\s*commit:\s*(\S+)/im, (_, commit) => {
				commitFromSummary = commit;

				return '';
			})
			.replace(/^\s*(?:author|user):\s*@?(\S+)/gim, (_, user) => {
				usersFromSummary.push(user);

				return '';
			})
			.trim();

		const [firstLine, ...futureLines] = replacedChangelog.split('\n').map((l) => l.trimEnd());

		const links = await (async () => {
			if (prFromSummary !== undefined) {
				let { links: resultLinks } = await getInfoFromPullRequest({
					repo: options.repo,
					pull: prFromSummary,
				});

				if (commitFromSummary) {
					resultLinks = {
						...resultLinks,
						commit: `[\`${commitFromSummary}\`](https://github.com/${options.repo}/commit/${commitFromSummary})`,
					};
				}

				return resultLinks;
			}

			const commitToFetchFrom = commitFromSummary || changeset.commit;

			if (commitToFetchFrom) {
				let { links: resultLinks } = await getInfo({
					repo: options.repo,
					commit: commitToFetchFrom,
				});

				return resultLinks;
			}

			return {
				commit: null,
				pull: null,
				user: null,
			};
		})();

		const users = usersFromSummary.length
			? usersFromSummary
					.map((userFromSummary) => `[@${userFromSummary}](https://github.com/${userFromSummary})`)
					.join(', ')
			: links.user;

		const suffix = [
			links.pull === null ? '' : ` (${links.pull})`,
			users === null ? '' : ` (${users})`,
		].join('');

		const line = `${firstLine}${futureLines.map((l) => `  ${l}`).join('\n')}${suffix}`;

		return line ? `- ${line}.` : '';
	},
	async getDependencyReleaseLine() {
		return '';
	},
};

module.exports = changelogFunctions;
