// @ts-check

// based on https://github.com/changesets/changesets/blob/main/packages/changelog-github/src/index.ts

const { getInfo, getInfoFromPullRequest } = require('@changesets/get-github-info');

/**
 * @type {import('@changesets/types').ChangelogFunctions}
 */
const changelogFunctions = {
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
			.replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
				commitFromSummary = commit;
				return '';
			})
			.replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
				usersFromSummary.push(user);
				return '';
			})
			.trim();

		const [firstLine, ...futureLines] = replacedChangelog.split('\n').map((l) => l.trimEnd());

		const links = await (async () => {
			if (prFromSummary !== undefined) {
				let { links } = await getInfoFromPullRequest({
					repo: options.repo,
					pull: prFromSummary,
				});
				if (commitFromSummary) {
					links = {
						...links,
						commit: `[\`${commitFromSummary}\`](https://github.com/${options.repo}/commit/${commitFromSummary})`,
					};
				}
				return links;
			}
			const commitToFetchFrom = commitFromSummary || changeset.commit;
			if (commitToFetchFrom) {
				let { links } = await getInfo({
					repo: options.repo,
					commit: commitToFetchFrom,
				});
				return links;
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
			links.pull === null ? '' : ` ${links.pull}`,
			users === null ? '' : ` Thanks ${users}!`,
		].join('');

		return `\n\n- ${firstLine}${futureLines.map((l) => `  ${l}`).join('\n')}${
			suffix ? ' (' + suffix + ')' : ''
		}.\n`;
	},
	async getDependencyReleaseLine() {
		return '';
	},
};

module.exports = changelogFunctions;
