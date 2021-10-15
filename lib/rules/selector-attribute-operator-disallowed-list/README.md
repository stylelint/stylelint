# selector-attribute-operator-disallowed-list

Specify a list of disallowed attribute operators.

<!-- prettier-ignore -->
```css
[target="_blank"] {}
/**    ↑
 * This operator */
```

## Options

`array|string`: `["array", "of", "operators"]|"operator"`

Given:

```json
["*="]
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
