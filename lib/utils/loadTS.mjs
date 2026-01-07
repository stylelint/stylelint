import { rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';

/**
 * @param {string} filepath
 * @param {string} content
 * @returns {Promise<import('stylelint').Config>}
 */
export default async function loadTS(filepath, content) {
	let ts;

	try {
		// eslint-disable-next-line n/no-unpublished-import
		ts = (await import('typescript')).default;
	} catch {
		try {
			// eslint-disable-next-line n/no-unpublished-import
			ts = await import('typescript');
		} catch (error) {
			throw new Error(
				// @ts-ignore
				`TypeScript is required to load ${filepath}: ${error.message}`,
			);
		}
	}

	if (!ts.transpileModule) {
		// @ts-ignore
		if (ts.default && ts.default.transpileModule) {
			// @ts-ignore
			ts = ts.default;
		}
	}

	const compiled = ts.transpileModule(content, {
		compilerOptions: {
			module: ts.ModuleKind.ESNext,
			target: ts.ScriptTarget.ESNext,
		},
	});

	// Use a unique file path to avoid race conditions
	const tempFile = `${filepath}.${randomUUID()}.mjs`;

	try {
		await writeFile(tempFile, compiled.outputText);
		const result = await import(pathToFileURL(tempFile).href);

		return result.default || result;
	} finally {
		await rm(tempFile, { force: true, maxRetries: 3 });
	}
}
