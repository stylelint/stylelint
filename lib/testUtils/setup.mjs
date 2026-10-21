import { afterEach } from 'node:test';
import os from 'node:os';
import process from 'node:process';
import { syncBuiltinESMExports } from 'node:module';

import { clearEmittedWarnings } from '../utils/emitWarning.mjs';

// Jest set this implicitly; `createStylelint` and `clearEmittedWarnings` branch on it.
process.env.NODE_ENV ??= 'test';

// Rules fall back to `os.EOL` when the code has no newline,
Object.defineProperty(os, 'EOL', { ...Object.getOwnPropertyDescriptor(os, 'EOL'), value: '\n' });
syncBuiltinESMExports();

// A warning is emitted once per process, so a test expecting one needs the previous tests' cleared.
afterEach(clearEmittedWarnings);
