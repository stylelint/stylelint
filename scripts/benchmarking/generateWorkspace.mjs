/* eslint-disable no-console */

/** @typedef {import('./config.mjs').WorkspaceSize} WorkspaceSize */
/** @typedef {import('./config.mjs').WorkspaceSizeConfig} WorkspaceSizeConfig */
/** @typedef {import('./config.mjs').WorkspaceInfo} WorkspaceInfo */
/** @typedef {import('./config.mjs').PluginInfo} PluginInfo */

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import pc from 'picocolors';

import { AVAILABLE_RULES, CSS_TEMPLATES, WORKSPACE_SIZES } from './config.mjs';
import {
	generateExtendedConfig,
	generatePlugins,
	generateSyntaxes,
} from './generateExtensions.mjs';

/**
 * Seeded pseudo-random number generator, using the mulberry32 algorithm.
 * Ensures reproducible, deterministic workspace generation across runs.
 *
 * @param {number} seed Initial seed value.
 * @returns {() => number} Function returning pseudorandom numbers in [0, 1).
 */
function createSeededRandom(seed) {
	let state = seed;

	return () => {
		state |= 0;
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);

		t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);

		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Default seed for benchmarks. */
const DEFAULT_SEED = 0x6c696e74; // "lint" in hex.

/** Directory names used for workspace structure. */
const DIR_NAMES = ['components', 'layouts', 'pages', 'features', 'shared', 'utils', 'styles'];

/** Seeded random number generator. */
const random = createSeededRandom(DEFAULT_SEED);

/**
 * Generate a random component name.
 *
 * @returns {string}
 */
function randomComponentName() {
	const prefixes = ['app', 'ui', 'core', 'common', 'shared', 'feature', 'page', 'layout', 'widget'];
	const suffixes = [
		'button',
		'card',
		'modal',
		'form',
		'list',
		'table',
		'nav',
		'header',
		'footer',
		'sidebar',
		'menu',
		'panel',
		'container',
		'wrapper',
		'section',
		'hero',
		'banner',
		'alert',
		'badge',
		'tag',
	];
	const prefix = prefixes[Math.floor(random() * prefixes.length)];
	const suffix = suffixes[Math.floor(random() * suffixes.length)];

	return `${prefix}-${suffix}-${Math.floor(random() * 1000)}`;
}

/**
 * Generate CSS content from templates.
 *
 * @param {string} name Component name
 * @returns {string}
 */
function generateCSSContent(name) {
	const template = CSS_TEMPLATES[Math.floor(random() * CSS_TEMPLATES.length)];

	return template.replace(/\{\{name\}\}/g, name);
}

/**
 * Generate directory structure.
 *
 * @param {string} baseDir Base directory.
 * @param {number} depth Current depth.
 * @param {number} maxDepth Maximum depth.
 * @param {number} dirsPerLevel Directories per level.
 * @returns {Promise<string[]>} List of created directories.
 */
async function generateDirectoryTree(baseDir, depth, maxDepth, dirsPerLevel) {
	const dirs = [baseDir];

	if (depth >= maxDepth) {
		return dirs;
	}

	for (let i = 0; i < dirsPerLevel && i < DIR_NAMES.length; i++) {
		const dirName = DIR_NAMES[i];
		const dirPath = join(baseDir, dirName);

		await mkdir(dirPath, { recursive: true });

		const subDirs = await generateDirectoryTree(dirPath, depth + 1, maxDepth, dirsPerLevel - 1);

		dirs.push(...subDirs);
	}

	return dirs;
}

/**
 * Generate stylelint config.
 *
 * @param {Object} options Configuration options.
 * @param {number} options.rules Number of rules.
 * @param {number} options.overrides Number of overrides.
 * @param {number} options.dirsPerLevel Directories per level.
 * @param {Array} options.plugins Plugin info.
 * @param {Array} options.extends Extended config paths.
 * @param {string[]} options.files List of files for override targeting.
 * @param {Array} options.syntaxes Custom syntax info.
 * @returns {Object} Stylelint config.
 */
function generateConfig({
	rules,
	overrides,
	dirsPerLevel,
	plugins,
	extends: extendConfigs,
	files,
	syntaxes,
}) {
	const config = {
		rules: {},
	};

	// Add rules.
	const selectedRules = AVAILABLE_RULES.slice(0, rules);

	for (const rule of selectedRules) {
		// Simple rule configuration. Most rules just need true.
		if (rule.includes('max-') || rule.includes('min-')) {
			config.rules[rule] = 3;
		} else if (rule.includes('-notation')) {
			config.rules[rule] = null; // Disable notation rules to avoid conflicts.
		} else if (rule.includes('-list')) {
			config.rules[rule] = null; // Disable list rules.
		} else if (rule.includes('-quotes')) {
			config.rules[rule] = 'always';
		} else if (rule === 'color-hex-length') {
			config.rules[rule] = 'short';
		} else if (rule === 'value-keyword-case' || rule === 'function-name-case') {
			config.rules[rule] = 'lower';
		} else {
			config.rules[rule] = true;
		}
	}

	// Add plugins.
	if (plugins && plugins.length > 0) {
		config.plugins = plugins.map((p) => p.path);

		// Add plugin rules.
		for (const plugin of plugins) {
			config.rules[plugin.ruleName] = true;
		}
	}

	// Add extends.
	if (extendConfigs && extendConfigs.length > 0) {
		config.extends = extendConfigs;
	}

	// Add custom syntax overrides. Each syntax gets its own override for its
	// file extension.
	if (syntaxes && syntaxes.length > 0) {
		if (!config.overrides) {
			config.overrides = [];
		}

		for (const syntax of syntaxes) {
			config.overrides.push({
				files: [`**/*${syntax.extension}`],
				customSyntax: syntax.path,
			});
		}
	}

	// Add other overrides.
	if (overrides > 0 && files.length > 0) {
		if (!config.overrides) {
			config.overrides = [];
		}

		// Create overrides targeting different file patterns.
		const dirPatterns = DIR_NAMES.slice(0, dirsPerLevel).map((dir) => `**/${dir}/**/*.css`);
		const patterns = ['**/*.css', ...dirPatterns];

		for (let i = 0; i < overrides; i++) {
			const pattern = patterns[i % patterns.length];
			const overrideRules = {};

			// Add a few rules to each override.
			const overrideRuleCount = Math.min(3, selectedRules.length);

			for (let j = 0; j < overrideRuleCount; j++) {
				const ruleIndex = (i + j) % selectedRules.length;
				const rule = selectedRules[ruleIndex];

				// Toggle the rule or change its value.
				if (config.rules[rule] === true) {
					overrideRules[rule] = null; // Disable in override.
				} else if (config.rules[rule] === null) {
					overrideRules[rule] = true; // Enable in override.
				}
			}

			config.overrides.push({
				files: [pattern],
				rules: overrideRules,
			});
		}
	}

	return config;
}

/**
 * Generate a complete workspace.
 *
 * @param {string} workspacePath Path to create workspace.
 * @param {WorkspaceSize} size Workspace size.
 * @param {{ logger?: (msg: string) => void }} [options] Options.
 * @returns {Promise<WorkspaceInfo>} Workspace info.
 */
export async function generateWorkspace(workspacePath, size, options = {}) {
	const log = options.logger ?? console.log;
	const sizeConfig = WORKSPACE_SIZES[size];

	if (!sizeConfig) {
		throw new Error(`Unknown workspace size: ${size}`);
	}

	log(`  Generating ${pc.cyan(sizeConfig.name)} workspace...`);

	// Clean and create workspace directory.
	await rm(workspacePath, { recursive: true, force: true });
	await mkdir(workspacePath, { recursive: true });

	// Create directory structure.
	const srcDir = join(workspacePath, 'src');

	await mkdir(srcDir, { recursive: true });

	const directories = await generateDirectoryTree(
		srcDir,
		0,
		sizeConfig.maxDepth,
		sizeConfig.dirsPerLevel,
	);

	// Generate custom syntaxes.
	const syntaxDir = join(workspacePath, '.stylelint-syntaxes');
	const syntaxes = await generateSyntaxes(syntaxDir, sizeConfig.syntaxes);

	// Build list of extensions. .css is always included, plus extensions with
	// custom syntaxes.
	const extensions = ['.css', ...syntaxes.map((s) => s.extension)];

	// Generate CSS files.
	const files = [];
	const filesPerDir = Math.ceil(sizeConfig.files / directories.length);

	for (const dir of directories) {
		const fileCount = Math.min(filesPerDir, sizeConfig.files - files.length);

		for (let i = 0; i < fileCount && files.length < sizeConfig.files; i++) {
			const componentName = randomComponentName();
			const ext = extensions[Math.floor(random() * extensions.length)];
			const fileName = `${componentName}${ext}`;
			const filePath = join(dir, fileName);
			const content = generateCSSContent(componentName);

			await writeFile(filePath, content);
			files.push(filePath);
		}
	}

	// Generate plugins.
	const pluginDir = join(workspacePath, '.stylelint-plugins');
	const plugins = await generatePlugins(pluginDir, sizeConfig.plugins);

	// Generate extended configs.
	const configDir = join(workspacePath, '.stylelint-configs');
	const extendConfigs = [];

	for (let i = 0; i < sizeConfig.extends; i++) {
		const configPath = await generateExtendedConfig(configDir, i, 5);

		extendConfigs.push(configPath);
	}

	// Generate main config.
	const config = generateConfig({
		rules: sizeConfig.rules,
		overrides: sizeConfig.overrides,
		dirsPerLevel: sizeConfig.dirsPerLevel,
		plugins,
		extends: extendConfigs,
		files,
		syntaxes,
	});

	const configPath = join(workspacePath, 'stylelint.config.mjs');
	const configContent = `/** @type {import('stylelint').Config} */
export default ${JSON.stringify(config, null, 2)};
`;

	await writeFile(configPath, configContent);

	log(`    ${pc.green('✓')} Created ${files.length} files in ${directories.length} directories`);
	log(`    ${pc.green('✓')} Config: ${sizeConfig.rules} rules, ${sizeConfig.overrides} overrides`);
	log(
		`    ${pc.green('✓')} Plugins: ${plugins.length}, Extends: ${extendConfigs.length}, Syntaxes: ${syntaxes.length}`,
	);

	return {
		path: workspacePath,
		size,
		sizeConfig,
		files,
		directories,
		plugins,
		extendConfigs,
		syntaxes,
		configPath,
	};
}

/**
 * Generate all workspace sizes.
 *
 * @param {string} baseDir Base directory for workspaces.
 * @returns {Promise<Record<WorkspaceSize, WorkspaceInfo>>} Map of size to workspace info.
 */
export async function generateAllWorkspaces(baseDir) {
	const workspaces = {};

	for (const size of Object.keys(WORKSPACE_SIZES)) {
		const workspacePath = join(baseDir, size);

		workspaces[size] = await generateWorkspace(workspacePath, size);
	}

	return workspaces;
}
