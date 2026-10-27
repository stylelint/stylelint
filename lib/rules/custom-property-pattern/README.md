# custom-property-pattern

Specify a pattern for custom properties.

<!-- prettier-ignore -->
```css
a { --foo-: 1px; }
/**   ↑
 * The pattern of this */
```

You can use this rule to enforce a convention. For example, require:

- kebab-case names
- a prefix for what they hold, e.g. `^(color|space|font|radius)-`
- a namespace, e.g. `^foo-`, so that a library's properties can't collide with a consumer's

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the custom property name and the configured pattern.

## Options

### `string`

Specify a regex string not surrounded with `"/"`.

Given:

```json
{
  "custom-property-pattern": "foo-.+"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
:root { --boo-bar: 0; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
:root { --foo-bar: 0; }
```
