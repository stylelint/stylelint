# keyframes-name-pattern

Specify a pattern for keyframe names.

<!-- prettier-ignore -->
```css
@keyframes slide-right {}
/**             ↑
 * The pattern of this */
```

Use this rule to enforce a convention. For example, require:

- kebab-case names for consistency with the specifications' examples
- a namespace, e.g. `^foo-`, as `@keyframes` names are global and can collide across stylesheets

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the keyframes name and the configured pattern.

## Options

### `string`

Specify a regex string not surrounded with `"/"`.

Given:

```json
{
  "keyframes-name-pattern": "foo-.+"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@keyframes foo {}
```

<!-- prettier-ignore -->
```css
@keyframes bar {}
```

<!-- prettier-ignore -->
```css
@keyframes FOO-bar {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@keyframes foo-bar {}
```
