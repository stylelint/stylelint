import { clearEmittedDeprecationWarnings } from './lib/utils/emitDeprecationWarning.mjs';
import { clearEmittedExperimentalWarnings } from './lib/utils/emitExperimentalWarning.mjs';

afterEach(() => {
	clearEmittedDeprecationWarnings();
	clearEmittedExperimentalWarnings();
});
