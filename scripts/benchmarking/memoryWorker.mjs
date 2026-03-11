import os from 'node:os';
import { parentPort } from 'node:worker_threads';
import process from 'node:process';

const isWindows = os.platform() === 'win32';

/**
 * Check if process is alive without sending a signal.
 *
 * @param {number} pid
 * @returns {boolean}
 */
function isProcessAlive(pid) {
	try {
		process.kill(pid, 0);

		return true;
	} catch {
		return false;
	}
}

/**
 * Platform-specific memory fetcher.
 * @type {(pid: number) => Promise<number|null>}
 */
let getProcessMemory;

if (isWindows) {
	const { getProcessTree, ProcessDataFlag } = await import('@vscode/windows-process-tree');

	getProcessMemory = (pid) =>
		new Promise((resolve) => {
			// Guard against calling native code on a dead process. Otherwise,
			// this can cause 0xC0000409 (STATUS_STACK_BUFFER_OVERRUN) errors.
			if (!isProcessAlive(pid)) {
				resolve(null);

				return;
			}

			getProcessTree(
				pid,
				(tree) => {
					if (tree && tree.memory !== undefined) {
						resolve(tree.memory);
					} else {
						resolve(null);
					}
				},
				ProcessDataFlag.Memory,
			);
		});
} else {
	const pidusage = (await import('pidusage')).default;

	getProcessMemory = async (pid) => {
		try {
			const stats = await pidusage(pid);

			return stats?.memory ?? null;
		} catch {
			return null;
		}
	};
}

let targetPid = null;
let peakMemory = 0;
let polling = false;
let stopPolling = false;

async function pollMemory() {
	if (stopPolling || polling || !targetPid) return;

	polling = true;

	try {
		const memory = await getProcessMemory(targetPid);

		if (memory !== null && memory > peakMemory) {
			peakMemory = memory;
		}
	} catch {
		// Process may have exited, ignore errors.
	} finally {
		polling = false;

		if (!stopPolling) {
			setTimeout(pollMemory, 50);
		}
	}
}

// Handle messages from main thread.
parentPort.on('message', (message) => {
	if (message.type === 'start') {
		targetPid = message.pid;
		peakMemory = 0;
		stopPolling = false;
		pollMemory();
	} else if (message.type === 'stop') {
		stopPolling = true;
		parentPort.postMessage({ type: 'result', peakMemory });
	}
});
