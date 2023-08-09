import uniteSets from '../utils/uniteSets.mjs';

export const lengthUnits = new Set([
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
	'dvb',
	'dvh',
	'dvi',
	'dvmax',
	'dvmin',
	'dvw',
	'lvb',
	'lvh',
	'lvi',
	'lvmax',
	'lvmin',
	'lvw',
	'svb',
	'svh',
	'svi',
	'svmax',
	'svmin',
	'svw',
	'vb',
	'vh',
	'vi',
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

export const resolutionUnits = new Set(['dpi', 'dpcm', 'dppx', 'x']);

export const units = uniteSets(lengthUnits, resolutionUnits, [
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
]);
