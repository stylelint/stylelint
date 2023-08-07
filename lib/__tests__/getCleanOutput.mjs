import stripAnsi from 'strip-ansi';

const symbolConversions = new Map();

symbolConversions.set('ℹ', 'i');
symbolConversions.set('✔', '√');
symbolConversions.set('⚠', '‼');
symbolConversions.set('✖', '×');

/**
 * @param {string} output
 *
 * @returns {string}
 */
export default function getCleanOutput(output) {
	let cleanOutput = stripAnsi(output).trim();

	for (const [nix, win] of symbolConversions.entries()) {
		cleanOutput = cleanOutput.replace(new RegExp(nix, 'g'), win);
	}

	return cleanOutput;
}
