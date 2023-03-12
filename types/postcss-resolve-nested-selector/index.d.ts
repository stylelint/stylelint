import { Node } from 'postcss';

declare function resolvedNestedSelector(selector: string, node: Node): string[];

export = resolvedNestedSelector;
