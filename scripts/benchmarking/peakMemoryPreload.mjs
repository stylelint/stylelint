import process from 'node:process';
import { writeSync } from 'node:fs';

import { PEAK_MEMORY_FD } from './config.mjs';

process.on('exit', () => {
	// maxRSS is in kibibytes.
	writeSync(PEAK_MEMORY_FD, String(process.resourceUsage().maxRSS * 1024));
});
