# selector-attribute-operator-disallowed-list

Specify a list of disallowed attribute operators.

<!-- prettier-ignore -->
```css
[target="_blank"] {}
/**    ↑
 * This operator */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `Array<string>`

```json
["array", "of", "attribute-operators"]
```

Given:

```json
{
  "selector-attribute-operator-disallowed-list": ["*="]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
[class*="test"] {}
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
