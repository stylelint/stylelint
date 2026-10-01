import { resourceLimits } from 'node:worker_threads';

// Surfaces the worker's own resource limits through the error-propagation
// path, so a test can assert workers run with an explicit memory limit.
export default {
	parse() {
		throw new Error(`maxOldGenerationSizeMb=${resourceLimits.maxOldGenerationSizeMb}`);
	},
	stringify() {},
};
