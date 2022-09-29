'use strict';

const uniteSets = require('../utils/uniteSets.js');

const lengthUnits = new Set([
	// Font-relative length units
	'cap',
	'ch',
	'em',
	'ex',
	'ic',
	'lh',
	'rcap',
	'rch',
	'rem',
	'rex',
	'ric',
	'rlh',
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
	// Container query units
	'cqw',
	'cqh',
	'cqi',
	'cqb',
	'cqmin',
	'cqmax',
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
