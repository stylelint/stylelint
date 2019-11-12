/* @flow */
'use strict';

/**
 * @param {{ stack: any, code: any }} err
 * @returns {void}
 */
module.exports = function(err /*: { stack: any, code: any }*/) /*: void */ {
	console.log(err.stack); // eslint-disable-line no-console
	const exitCode = typeof err.code === 'number' ? err.code : 1;

	process.exit(exitCode); // eslint-disable-line no-process-exit
};
