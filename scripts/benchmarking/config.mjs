/**
 * @typedef {'small' | 'medium' | 'large' | 'xlarge'} WorkspaceSize
 */

/**
 * @typedef {'api' | 'cli'} BenchmarkMode
 */

/**
 * @typedef {Object} WorkspaceSizeConfig
 * @property {string} name Display name.
 * @property {string} description Description of the workspace size.
 * @property {number} files Number of CSS files to generate.
 * @property {number} maxDepth Maximum directory depth.
 * @property {number} dirsPerLevel Directories per level.
 * @property {number} rules Number of rules in config.
 * @property {number} overrides Number of config overrides.
 * @property {number} plugins Number of plugins to generate.
 * @property {number} extends Number of extended configs.
 * @property {number} syntaxes Number of custom syntaxes to generate.
 */

/**
 * @typedef {Object} WorkspaceInfo
 * @property {string} path Path to the workspace.
 * @property {WorkspaceSize} size Size identifier.
 * @property {WorkspaceSizeConfig} sizeConfig Size configuration.
 * @property {string[]} files List of generated file paths.
 * @property {string[]} directories List of generated directories.
 * @property {PluginInfo[]} plugins Generated plugin info.
 * @property {string[]} extendConfigs Extended config paths.
 * @property {SyntaxInfo[]} syntaxes Generated custom syntax info.
 * @property {string} configPath Path to main stylelint config.
 */

/**
 * @typedef {Object} PluginInfo
 * @property {string} path Path to the plugin file.
 * @property {string} ruleName Plugin rule name.
 */

/**
 * @typedef {Object} SyntaxInfo
 * @property {string} path Path to the syntax file.
 * @property {string} name Syntax name, e.g. "scss", "less".
 * @property {string} extension File extension this syntax handles.
 */

/**
 * @typedef {Object} BenchmarkOptions
 * @property {number} [iterations] Number of measured iterations.
 * @property {number} [warmup] Number of warmup iterations (discarded).
 * @property {BenchmarkMode} [mode] Benchmark mode.
 * @property {(message: string) => void} [logger] Logger function.
 */

/**
 * @typedef {Object} BenchmarkResult
 * @property {WorkspaceSize} workspace Workspace size.
 * @property {WorkspaceSizeConfig} workspaceConfig Workspace config.
 * @property {number} iterations Number of iterations run.
 * @property {number} filesLinted Number of files linted.
 * @property {number} errorsFound Number of errors found.
 * @property {TimingStats} timing Timing statistics.
 * @property {MemoryStats} memory Memory statistics.
 * @property {PerFileStats} perFile Per-file statistics.
 * @property {RawResult[]} raw Raw results from each iteration.
 */

/**
 * @typedef {Object} TimingStats
 * @property {number} min Minimum duration.
 * @property {number} max Maximum duration.
 * @property {number} mean Mean duration.
 * @property {number} median Median duration.
 * @property {number} trimmedMean Mean with top and bottom 10% removed.
 * @property {number} stdDev Standard deviation.
 * @property {number} cv Coefficient of variation.
 * @property {number} p95 95th percentile duration.
 */

/**
 * @typedef {Object} MemoryStats
 * @property {number} avgUsed Average memory used.
 * @property {number} peakHeap Peak heap usage.
 */

/**
 * @typedef {Object} PerFileStats
 * @property {number} mean Mean time per file.
 */

/**
 * @typedef {Object} RawResult
 * @property {number} duration Duration in milliseconds.
 * @property {number} filesLinted Files linted.
 * @property {number} errorsFound Errors found.
 * @property {number} memoryUsed Memory used delta.
 * @property {number} peakMemory Peak memory.
 */

/** @type {Record<WorkspaceSize, WorkspaceSizeConfig>} */
export const WORKSPACE_SIZES = {
	small: {
		name: 'Small',
		description: '20 files, simple config, no overrides',
		files: 20,
		maxDepth: 2,
		dirsPerLevel: 2,
		rules: 10,
		overrides: 0,
		plugins: 0,
		extends: 0,
		syntaxes: 0,
	},
	medium: {
		name: 'Medium',
		description: '100 files, moderate config, 10 overrides',
		files: 100,
		maxDepth: 4,
		dirsPerLevel: 3,
		rules: 25,
		overrides: 10,
		plugins: 2,
		extends: 1,
		syntaxes: 1,
	},
	large: {
		name: 'Large',
		description: '500 files, complex config, 50 overrides',
		files: 500,
		maxDepth: 6,
		dirsPerLevel: 4,
		rules: 50,
		overrides: 50,
		plugins: 5,
		extends: 2,
		syntaxes: 2,
	},
	xlarge: {
		name: 'X-Large',
		description: '1000 files, stress test config, 200 overrides',
		files: 1000,
		maxDepth: 7,
		dirsPerLevel: 5,
		rules: 80,
		overrides: 200,
		plugins: 8,
		extends: 3,
		syntaxes: 3,
	},
};

// CSS content templates for generating realistic files.
export const CSS_TEMPLATES = [
	// Simple component styles.
	`/* Component: {{name}} */
.{{name}} {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.{{name}}__header {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333333;
  margin-bottom: 0.5rem;
}

.{{name}}__content {
  flex: 1;
  padding: 1rem 0;
}

.{{name}}__footer {
  border-top: 1px solid #e0e0e0;
  padding-top: 0.5rem;
  text-align: right;
}
`,
	// Button styles.
	`/* Button: {{name}} */
.btn-{{name}} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.btn-{{name}}:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-{{name}}:active {
  transform: translateY(0);
}

.btn-{{name}}:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-{{name}}--primary {
  background-color: #007bff;
  color: #ffffff;
  border: none;
}

.btn-{{name}}--secondary {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}
`,
	// Form styles.
	`/* Form: {{name}} */
.form-{{name}} {
  max-width: 400px;
  margin: 0 auto;
}

.form-{{name}} .form-group {
  margin-bottom: 1rem;
}

.form-{{name}} label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #495057;
}

.form-{{name}} input,
.form-{{name}} textarea,
.form-{{name}} select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.form-{{name}} input:focus,
.form-{{name}} textarea:focus,
.form-{{name}} select:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
`,
	// Grid layout.
	`/* Grid: {{name}} */
.grid-{{name}} {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.grid-{{name}}__item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.grid-{{name}}__item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .grid-{{name}} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
`,
	// Navigation styles.
	`/* Nav: {{name}} */
.nav-{{name}} {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #343a40;
}

.nav-{{name}}__brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  margin-right: 2rem;
}

.nav-{{name}}__links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
}

.nav-{{name}}__link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.5rem;
  transition: color 0.15s;
}

.nav-{{name}}__link:hover,
.nav-{{name}}__link--active {
  color: #ffffff;
}
`,
];

// Available rules for config generation.
export const AVAILABLE_RULES = [
	'block-no-empty',
	'color-no-invalid-hex',
	'comment-no-empty',
	'declaration-block-no-duplicate-properties',
	'declaration-block-no-shorthand-property-overrides',
	'font-family-no-duplicate-names',
	'function-calc-no-unspaced-operator',
	'keyframe-declaration-no-important',
	'media-feature-name-no-unknown',
	'no-descending-specificity',
	'no-duplicate-at-import-rules',
	'no-duplicate-selectors',
	'no-empty-source',
	'no-invalid-double-slash-comments',
	'property-no-unknown',
	'selector-pseudo-class-no-unknown',
	'selector-pseudo-element-no-unknown',
	'selector-type-no-unknown',
	'string-no-newline',
	'unit-no-unknown',
	'alpha-value-notation',
	'color-function-notation',
	'color-hex-length',
	'font-family-name-quotes',
	'function-name-case',
	'function-url-quotes',
	'import-notation',
	'keyframe-selector-notation',
	'length-zero-no-unit',
	'media-feature-range-notation',
	'number-max-precision',
	'selector-not-notation',
	'selector-pseudo-element-colon-notation',
	'shorthand-property-no-redundant-values',
	'value-keyword-case',
	'declaration-block-single-line-max-declarations',
	'declaration-property-max-values',
	'max-nesting-depth',
	'selector-max-attribute',
	'selector-max-class',
	'selector-max-combinators',
	'selector-max-compound-selectors',
	'selector-max-id',
	'selector-max-pseudo-class',
	'selector-max-specificity',
	'selector-max-type',
	'selector-max-universal',
	'time-min-milliseconds',
	'at-rule-disallowed-list',
	'at-rule-allowed-list',
	'color-hex-alpha',
	'color-named',
	'color-no-hex',
	'comment-word-disallowed-list',
	'declaration-no-important',
	'declaration-property-unit-allowed-list',
	'declaration-property-value-disallowed-list',
	'function-disallowed-list',
	'function-url-no-scheme-relative',
	'function-url-scheme-disallowed-list',
	'media-feature-name-disallowed-list',
	'media-feature-name-unit-allowed-list',
	'media-feature-name-value-allowed-list',
	'property-disallowed-list',
	'rule-selector-property-disallowed-list',
	'selector-attribute-name-disallowed-list',
	'selector-attribute-operator-disallowed-list',
	'selector-combinator-disallowed-list',
	'selector-disallowed-list',
	'selector-no-qualifying-type',
	'selector-no-vendor-prefix',
	'selector-pseudo-class-disallowed-list',
	'selector-pseudo-element-disallowed-list',
	'unit-disallowed-list',
	'value-no-vendor-prefix',
	'at-rule-empty-line-before',
	'comment-empty-line-before',
	'custom-property-empty-line-before',
	'declaration-empty-line-before',
	'rule-empty-line-before',
];

// Benchmark defaults.
export const BENCHMARK_ITERATIONS = 10;
export const BENCHMARK_WARMUP = 2;

/** @type {BenchmarkMode[]} */
export const DEFAULT_MODES = ['api', 'cli'];
