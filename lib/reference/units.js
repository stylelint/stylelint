'use strict';

const uniteSets = require('../utils/uniteSets.js');

const lengthUnits = new Set([
	// Relative length units
	'em',
	'ex',
	'ch',
	'rem',
	'rlh',
	'lh',
	// Viewport-percentage lengths
	'dvh',
	'dvmax',
	'dvmin',
	'dvw',
	'lvh',
	'lvmax',
	'lvmin',
	'lvw',
	'svh',
	'svmax',
	'svmin',
	'svw',
	'vh',
	'vw',
	'vmin',
	'vmax',
	'vm',
	// Absolute length units
	'px',
	'mm',
	'cm',
	'in',
	'pt',
	'pc',
	'q',
	'mozmm',
	// Flexible length units
	'fr',
]);

const units = uniteSets(lengthUnits, [
	// Relative length units
	'%',
	// Time length units
	's',
	'ms',
	// Angle
	'deg',
	'grad',
	'turn',
	'rad',
	// Frequency
	'Hz',
	'kHz',
	// Resolution
	'dpi',
	'dpcm',
	'dppx',
]);

module.exports = {
	lengthUnits,
	units,
};
