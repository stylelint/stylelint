import { ConfigurationError } from './utils/errors.mjs';

const VALID_DIRECTIONS = new Set([
	'top-to-bottom',
	'bottom-to-top',
	'left-to-right',
	'right-to-left',
]);

const HORIZONTAL_DIRECTIONS = new Set(['left-to-right', 'right-to-left']);

/**
 * @param {import('stylelint').Config} config
 * @returns {void}
 */
export default function validateLanguageOptions(config) {
	const directionality = config.languageOptions?.directionality;

	if (!directionality) return;

	const { block, inline } = directionality;

	if (block === undefined && inline === undefined) return;

	if (block === undefined || inline === undefined) {
		throw new ConfigurationError(
			'Invalid languageOptions.directionality configuration: both "block" and "inline" must be specified.',
		);
	}

	if (!VALID_DIRECTIONS.has(block)) {
		throw new ConfigurationError(
			`Invalid languageOptions.directionality configuration: "block" must be one of "top-to-bottom", "bottom-to-top", "left-to-right", "right-to-left". Got "${block}".`,
		);
	}

	if (!VALID_DIRECTIONS.has(inline)) {
		throw new ConfigurationError(
			`Invalid languageOptions.directionality configuration: "inline" must be one of "top-to-bottom", "bottom-to-top", "left-to-right", "right-to-left". Got "${inline}".`,
		);
	}

	const blockIsHorizontal = HORIZONTAL_DIRECTIONS.has(block);
	const inlineIsHorizontal = HORIZONTAL_DIRECTIONS.has(inline);

	if (blockIsHorizontal === inlineIsHorizontal) {
		throw new ConfigurationError(
			`Invalid languageOptions.directionality configuration: "block" and "inline" must be on perpendicular axes. Got block: "${block}", inline: "${inline}".`,
		);
	}
}
