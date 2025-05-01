# selector-attribute-name-disallowed-list

Specify a list of disallowed attribute names.

<!-- prettier-ignore -->
```css
    [class~="foo"] {}
/**  ↑
 * This name */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

```json
["array", "of", "attribute-names", "/regex/"]
```

You can also specify a single attribute name instead of an array of them.

Given:

```json
{
  "selector-attribute-name-disallowed-list": ["class", "id", "/^data-/"]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
[class*="foo"] {}
```

<!-- prettier-ignore -->
```css
[id~="bar"] {}
```

<!-- prettier-ignore -->
```css
[data-foo*="bar"] {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
[lang~="en-us"] {}
```

<!-- prettier-ignore -->
```css
[target="_blank"] {}
```

<!-- prettier-ignore -->
```css
[href$=".bar"] {}
```
