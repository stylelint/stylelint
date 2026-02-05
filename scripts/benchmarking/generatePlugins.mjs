import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Generate a fake plugin file.
 *
 * @param {string} pluginDir Directory to write plugin to.
 * @param {number} index Plugin index for unique naming.
 * @returns {Promise<string>} Path to the generated plugin.
 */
export async function generatePlugin(pluginDir, index) {
	const pluginName = `perf-plugin-${index}`;
	const ruleName = `${pluginName}/test-rule`;

	const pluginContent = `/**
 * Auto-generated fake plugin for performance testing
 * Plugin: ${pluginName}
 */

const rule = (primary) => {
	return (root, result) => {
		// Minimal rule implementation for perf testing
		root.walkDecls((decl) => {
			// Just iterate, don't report anything
			// This simulates plugin overhead without noise
		});
	};
};

rule.ruleName = '${ruleName}';
rule.meta = {
	url: 'https://example.com/perf-test',
};

export default {
	ruleName: '${ruleName}',
	rule,
};
`;

	await mkdir(pluginDir, { recursive: true });
	const pluginPath = join(pluginDir, `${pluginName}.mjs`);

	await writeFile(pluginPath, pluginContent);

	return { path: pluginPath, ruleName };
}

/**
 * Generate multiple fake plugins.
 *
 * @param {string} pluginDir Directory to write plugins to.
 * @param {number} count Number of plugins to generate.
 * @returns {Promise<Array<{path: string, ruleName: string}>>}
 */
export async function generatePlugins(pluginDir, count) {
	const plugins = [];

	for (let i = 0; i < count; i++) {
		const plugin = await generatePlugin(pluginDir, i);

		plugins.push(plugin);
	}

	return plugins;
}

/**
 * Generate a fake extended config.
 *
 * @param {string} configDir Directory to write config to.
 * @param {number} index Config index.
 * @param {number} ruleCount Number of rules to include.
 * @returns {Promise<string>} Path to the generated config.
 */
export async function generateExtendedConfig(configDir, index, ruleCount) {
	const configName = `perf-config-${index}`;
	const rules = {};

	// Add some rules from the available rules list.
	const availableRules = [
		'color-hex-length',
		'length-zero-no-unit',
		'shorthand-property-no-redundant-values',
		'declaration-block-single-line-max-declarations',
		'number-max-precision',
		'value-keyword-case',
		'function-name-case',
		'selector-pseudo-element-colon-notation',
	];

	for (let i = 0; i < Math.min(ruleCount, availableRules.length); i++) {
		const rule = availableRules[i];

		if (rule === 'color-hex-length') {
			rules[rule] = 'short';
		} else if (rule === 'declaration-block-single-line-max-declarations') {
			rules[rule] = 1;
		} else if (rule === 'number-max-precision') {
			rules[rule] = 4;
		} else if (rule === 'value-keyword-case') {
			rules[rule] = 'lower';
		} else if (rule === 'function-name-case') {
			rules[rule] = 'lower';
		} else if (rule === 'selector-pseudo-element-colon-notation') {
			rules[rule] = 'double';
		} else {
			rules[rule] = true;
		}
	}

	const configContent = `/** @type {import('stylelint').Config} */
export default {
	rules: ${JSON.stringify(rules, null, '\t\t').replace(/^/gm, '\t').trim()},
};
`;

	await mkdir(configDir, { recursive: true });
	const configPath = join(configDir, `${configName}.mjs`);

	await writeFile(configPath, configContent);

	return configPath;
}
