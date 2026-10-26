// The package's default, `import('stylelint')`, can't resolve to this repository from `node_modules`.
export default function loadLint() {
	return import('../index.mjs').then((m) => m.default.lint);
}
