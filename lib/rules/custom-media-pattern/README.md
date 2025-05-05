# custom-media-pattern

Specify a pattern for custom media query names.

<!-- prettier-ignore -->
```css
@custom-media --foo (max-width: 30em);
/**             ↑
 * The pattern of this */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `string`

Specify a regex string not surrounded with `"/"`.

Given:

```json
{
  "custom-media-pattern": "foo-.+"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@custom-media --bar (min-width: 30em);
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@custom-media --foo-bar (min-width: 30em);
```
