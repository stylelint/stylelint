import { exit, stderr, stdout } from 'node:process';
import { EOL } from 'node:os';
import { execSync } from 'node:child_process';

function main() {
	try {
		execSync('git diff --exit-code --name-only -- lib', { encoding: 'utf8' });
	} catch (error) {
		if (error.stdout) {
			stdout.write(`You must commit the following files:${EOL}`);
			stdout.write(error.stdout);
		}

		if (error.stderr) {
			stderr.write(error.stderr);
		}

		if (typeof error.status === 'number') {
			exit(error.status);
		} else {
			throw error;
		}
	}
}

main();
