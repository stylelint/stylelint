import { BroadcastChannel, isMainThread } from 'node:worker_threads';
import fs from 'node:fs';

import stylelint from '../../index.mjs';

// Reports each write of a fixed file, and leaves time to abort before the temporary file is renamed
if (!isMainThread) {
	const { fsync } = fs;

	fs.fsync = (fd, callback) => {
		const channel = new BroadcastChannel('plugin-slow-write');

		channel.postMessage('writing');
		channel.close();
		setTimeout(() => fsync(fd, callback), 200);
	};
}

export default stylelint.createPlugin('plugin/slow-write', () => () => {});
