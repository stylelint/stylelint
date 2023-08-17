import { inspect } from 'node:util';

export default function customFormatter(results) {
	return inspect(results);
}
