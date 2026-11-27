import { isMainThread } from 'node:worker_threads';

import stylelint from '../../index.mjs';

// Keeps a worker thread alive
if (!isMainThread) setInterval(() => {}, 1000);

export default stylelint.createPlugin('plugin/holding-timer', () => () => {});
