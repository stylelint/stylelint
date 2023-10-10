import fs from 'node:fs';
import process from 'node:process';

fs.readdirSync('lib/rules')
	.filter((d) => !d.includes('__tests__') && !d.includes('.'))
	.forEach((d) => {
		process.stdout.write(`   get '${d}'() {
        return import('./${d}/index.mjs').then(m => m.default);
    },
`);
	});
