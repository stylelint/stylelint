import path from 'node:path';

/* eslint-disable n/no-extraneous-import */
import { SKIP, visitParents } from 'unist-util-visit-parents';
import { lintRule } from 'unified-lint-rule';
/* eslint-enable n/no-extraneous-import */

/**
 * Check if rule document links are valid.
 */
export default lintRule('stylelint:link-to-rule', (tree, file) => {
	visitParents(tree, 'link', (link, ancestors) => {
		if (link.url.startsWith('http')) return SKIP;

		const absolutePath = path.join(file.cwd, file.path, link.url);

		if (!absolutePath.includes('/rules/')) return SKIP;

		if (/\.m?js$/.test(absolutePath)) return SKIP;

		const report = (message) => {
			file.message(message, { ancestors, place: link.position });
		};

		if (!absolutePath.endsWith('README.md')) {
			report(`Expected "${link.url}" link to end with "README.md"`);
		}

		const [content] = link.children;

		if (!content) return SKIP;

		const ruleName = content.value;

		if (content.type !== 'inlineCode') {
			report(`Expected "${link.url}" link to have an inline code like "\`${ruleName}\`"`);
		}

		if (!(absolutePath.includes(`/${ruleName}/`) || absolutePath.endsWith(`/${ruleName}`))) {
			report(`Expected "${link.url}" link to include "${ruleName}"`);
		}
	});
});
