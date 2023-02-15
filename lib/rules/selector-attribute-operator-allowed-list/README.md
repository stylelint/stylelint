# selector-attribute-operator-allowed-list

Specify a list of allowed attribute operators.

<!-- prettier-ignore -->
```css
[target="_blank"] {}
/**    ↑
 * This operator */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string`: `["array", "of", "operators"]|"operator"`

Given:

```json
["=", "|="]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
[class*="test"] {}
```

<!-- prettier-ignore -->
```css
[title~="flower"] {}
```

<!-- prettier-ignore -->
```css
[class^="top"] {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
[target] {}
```

<!-- prettier-ignore -->
```css
[target="_blank"] {}
```

<!-- prettier-ignore -->
```css
[class|="top"] {}
```
