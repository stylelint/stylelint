import { performance } from 'node:perf_hooks';
import process from 'node:process';

import stylelint from '../../lib/index.mjs';

const [, , workspacePath, configPath] = process.argv;

// Signal we're about to start the lint operation.
process.send({ type: 'start' });

const startTime = performance.now();

const result = await stylelint.lint({
	files: `${workspacePath}/src/**/*.{css,scss,less,html,vue}`,
	configFile: configPath,
	cache: false,
});

const endTime = performance.now();

// Signal completion with results.
process.send({
	type: 'end',
	duration: endTime - startTime,
	filesLinted: result.results.length,
	errorsFound: result.results.reduce((sum, r) => sum + r.warnings.length, 0),
});
