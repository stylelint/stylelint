import { getInfo } from '@changesets/get-github-info';

/** @import { ChangelogFunctions } from '@changesets/types' */

const PREFIXES = ['Removed', 'Changed', 'Deprecated', 'Added', 'Fixed', 'Security'].join('|');
const SUMMARY_PATTERN = new RegExp(`^(?:${PREFIXES}): \\S`);

/** @type {ChangelogFunctions} */
export default {
	async getReleaseLine(changeset, _type, options) {
		const repo = options?.repo;

		if (!repo) throw new Error('"repo" option is required');

		const summary = changeset.summary.trim();

		if (!SUMMARY_PATTERN.test(summary)) {
			throw new Error(
				`Invalid changeset summary: ${JSON.stringify(summary)}, expected: "<${PREFIXES}>: <description>"`,
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
