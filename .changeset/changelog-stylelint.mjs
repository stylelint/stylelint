import { getCommitInfo } from '@changesets/get-github-info';

/** @import { ChangelogFunctions } from '@changesets/types' */

const TYPE_TO_PREFIXES = new Map([
	['major', ['Removed', 'Changed']],
	['minor', ['Added', 'Deprecated', 'Fixed']], // Possible: Fixed & false-negatives
	['patch', ['Fixed', 'Security']],
]);
const PREFIXES = [...new Set([...TYPE_TO_PREFIXES.values()].flat())].join('|');
const SUMMARY_PATTERN = new RegExp(`^(?<prefix>${PREFIXES}): \\S`);

/** @type {ChangelogFunctions} */
export default {
	async getReleaseLine(changeset, type, options) {
		const repo = options?.repo;

		if (!repo || typeof repo !== 'string') {
			throw new Error('"repo" option is required and must be a string');
		}

		const summary = changeset.summary.trim().replace(/\.+$/, ''); // strip trailing periods if any
		const match = SUMMARY_PATTERN.exec(summary);
		const prefix = match?.groups?.prefix;

		if (!match || !prefix) {
			throw new Error(
				`Invalid changeset summary: ${JSON.stringify(summary)}, expected: "<${PREFIXES}>: <description>"`,
			);
		}

		const allowedPrefixes = TYPE_TO_PREFIXES.get(type);

		if (allowedPrefixes && !allowedPrefixes.includes(prefix)) {
			throw new Error(
				`Invalid changeset: "${prefix}" prefix not allowed for "${type}" bump, expected: "${allowedPrefixes.join('|')}"`,
			);
		}

		const { commit } = changeset;
		const links = { pull: '', author: '' };

		if (commit) {
			const commitInfo = await getCommitInfo({ repo, commit });

			if (commitInfo) {
				links.pull = commitInfo.pull?.markdownLink ?? '';
				links.author = commitInfo.author?.markdownLink ?? '';
			}
		}

		/** @type {(s: string) => string} */
		const link = (s) => (s ? ` (${s})` : '');

		return `- ${summary}${link(links.pull)}${link(links.author)}.`;
	},

	async getDependencyReleaseLine() {
		return '';
	},
};
