'use strict';

const stripAnsi = require('strip-ansi');

const symbolConversions = new Map();

symbolConversions.set('ℹ', 'i');
symbolConversions.set('✔', '√');
symbolConversions.set('⚠', '‼');
symbolConversions.set('✖', '×');

module.exports = function(results, formatter) {
	let output = stripAnsi(formatter(results)).trim();

	symbolConversions.forEach((win, nix) => {
		output = output.replace(new RegExp(nix, 'g'), win);
	});

	return output;
};
