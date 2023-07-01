// eslint-disable-next-line n/no-extraneous-import -- We don't want to manage extra dependencies.
import { visit } from 'unist-util-visit';

/**
 * This plugin aims to make it easier to prepare a GitHub release.
 *
 * @see https://github.com/stylelint/stylelint/issues/6343#issuecomment-1250353973
 *
 * @type {import('unified').Plugin}
 */
export default function remarkChangelogToGitHubRelease() {
	return (tree) => {
		const firstList = tree.children.find((node) => node.type === 'list');

		// Rewrite a link to a PR notation (#123) or a user mention (@username).
		visit(firstList, { type: 'link' }, (node) => {
			const text = node.children[0];

			node.type = 'text';
			node.value = text.value;
		});

		tree.children.length = 0; // clear
		tree.children.push(firstList);
	};
}
