import { clearEmittedWarnings } from './lib/utils/emitWarning.mjs';

afterEach(() => {
	clearEmittedWarnings();
});
