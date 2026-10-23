import { registerHooks } from 'node:module';

/**
 * Loads one module in place of another for the rest of the process, so a test can stand in for a
 * package that isn't installed or for a module that the code under test imports lazily.
 *
 * @param {string} from A bare specifier, or the URL a specifier resolves to
 * @param {URL} to
 * @returns {void}
 */
export default function redirectModule(from, to) {
	registerHooks({
		resolve(specifier, context, nextResolve) {
			if (specifier === from) return { url: to.href, shortCircuit: true };

			const resolved = nextResolve(specifier, context);

			return resolved.url === from ? { ...resolved, url: to.href } : resolved;
		},
	});
}
