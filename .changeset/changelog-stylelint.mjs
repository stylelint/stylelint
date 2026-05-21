import { getInfo } from '@changesets/get-github-info';

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

		if (!repo) throw new Error('"repo" option is required');

		const summary = changeset.summary.trim();
		const match = SUMMARY_PATTERN.exec(summary);

		if (!match) {
			throw new Error(
				`Invalid changeset summary: ${JSON.stringify(summary)}, expected: "<${PREFIXES}>: <description>"`,
			);
		}

		const prefix = match.groups?.prefix ?? '';
		const allowedPrefixes = TYPE_TO_PREFIXES.get(type);

		if (allowedPrefixes && !allowedPrefixes.includes(prefix)) {
			throw new Error(
				`Invalid changeset: "${prefix}" prefix not allowed for "${type}" bump, expected: "${allowedPrefixes.join('|')}"`,
			);
		}

		const { commit } = changeset;
		const { links } = commit ? await getInfo({ repo, commit }) : { links: { pull: '', user: '' } };
		const { pull, user } = links;

		/** @type {(s: string | null) => string} */
		const link = (s) => (s ? ` (${s})` : '');

		return `- ${summary}${link(pull)}${link(user)}.`;
	},

	async getDependencyReleaseLine() {
		return '';
	},
};
