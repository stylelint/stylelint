import { isString } from './validateTypes.mjs';
// @ts-ignore
import { parse } from 'levn';

/**
 * @param { string[] | string } rules
 * @summary used to parse --rule(s) argument
 */
export default function addRules(rules) {
	/** @type { import('stylelint').Config } */
	const config = { rules: {} };

	if (Array.isArray(rules)) {
		const regexp = /^(['"]?)[a-z/]+(?:-[a-z]+)*\1\s*:.*/;

		rules
			.map((item) => item.trim())
			.forEach((str) => {
				if (str.startsWith('[') || !regexp.test(str)) throw Error('--rule argument is malformed.');

				const rule = parse('Object', str);

				config.rules = { ...config.rules, ...rule };
			});
	} else if (isString(rules)) {
		config.rules = parse('Object', rules);
	}

	return config;
}
