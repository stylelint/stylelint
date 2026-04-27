# container-name-pattern

Specify a pattern for container names.

<!-- prettier-ignore -->
```css
@container foo (width > 400px) {}
/**        ↑
 * The pattern of this */
```

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the container name and the configured pattern.

## Options

### `string`

Specify a regex string not surrounded with `"/"`.

Given:

```json
{
  "container-name-pattern": "foo-.+"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@container foo {}
```

<!-- prettier-ignore -->
```css
a { container-name: bar; }
```

<!-- prettier-ignore -->
```css
a { container: baz / inline-size; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@container foo-bar {}
```

<!-- prettier-ignore -->
```css
a { container-name: foo-bar; }
```

<!-- prettier-ignore -->
```css
a { container: foo-baz / inline-size; }
```
