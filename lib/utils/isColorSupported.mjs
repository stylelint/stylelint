import process from 'node:process';

/**
 * Detect whether the terminal supports color, originally copied from
 * https://github.com/alexeyraspopov/picocolors/blob/93bde36cc79a4b8a39319a048dea212ef08b1ea6/picocolors.js
 * without its `--color` and `--no-color` argument checks, which the CLI passes on as the `color` option.
 */
export default function isColorSupported() {
	const { env } = process;

	if (env.NO_COLOR) {
		return false;
	}

	return Boolean(
		env.FORCE_COLOR ||
		process.platform === 'win32' ||
		(process.stdout.isTTY && env.TERM !== 'dumb') ||
		env.CI,
	);
}
