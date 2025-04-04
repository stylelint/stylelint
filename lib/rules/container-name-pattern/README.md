# container-name-pattern

Specify a pattern for container names.

<!-- prettier-ignore -->
```css
@container foo (width > 400px) {}
/**        ↑
 * The pattern of this */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`regex|string`

A string will be translated into a RegExp like so `new RegExp(yourString)` — so be sure to escape properly.

Given the string:

```json
"foo-.+"
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
