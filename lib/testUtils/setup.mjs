import { afterEach } from 'node:test';
import process from 'node:process';

import { clearEmittedWarnings } from '../utils/emitWarning.mjs';

// Jest set this implicitly; `createStylelint` and `clearEmittedWarnings` branch on it.
process.env.NODE_ENV ??= 'test';

// A warning is emitted once per process, so a test expecting one needs the previous tests' cleared.
afterEach(clearEmittedWarnings);
