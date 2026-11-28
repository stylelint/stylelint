import process from 'node:process';

export default {
	parse() {
		// eslint-disable-next-line n/no-process-exit -- tests a worker exiting early
		process.exit(3);
	},
	stringify() {},
};
