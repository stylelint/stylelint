# selector-attribute-operator-allowed-list

Specify a list of allowed attribute operators.

<!-- prettier-ignore -->
```css
[target="_blank"] {}
/**    ↑
 * This operator */
```

You can use this rule to enforce a subset of attribute operators as a convention. For example, allow only `=`, `~=` and `|=` to match whole values.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the disallowed attribute operator.

## Options

### `Array<string>`

```json
["array", "of", "attribute-operators"]
```

Given:

```json
{
  "selector-attribute-operator-allowed-list": ["=", "|="]
}
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
