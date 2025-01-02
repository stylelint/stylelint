import { clearEmittedDeprecationWarnings } from './lib/utils/emitDeprecationWarning.mjs';

afterEach(() => {
	clearEmittedDeprecationWarnings();
});
