# declaration-property-value-allowed-list

Specify a list of allowed property and value pairs within declarations.

<!-- prettier-ignore -->
```css
a { text-transform: uppercase; }
/** ↑               ↑
 * These properties and these values */
```

Use this rule to enforce a subset of values for a property as a convention. For example, allow only:

- `/^(1|10|100|1000)$/` for `z-index`, so that stacking order follows a scale
- `400` and `700` for `font-weight`, so that only the weights you load are used

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the property name and the disallowed value.

## Options

### `Object<string, Array<string>>`

```json
{ "property-name": ["array", "of", "values", "/regex/"] }
```

You can specify a regex for a property name, such as `{ "/^animation/": [] }`.

If a property name is found in the object, only the listed property values are allowed. This rule complains about all non-matching values. (If the property name is not included in the object, anything goes.)

The same goes for values. Keep in mind that a regular expression value is matched against the entire value of the declaration, not specific parts of it. For example, a value like `"10px solid rgba( 255 , 0 , 0 , 0.5 )"` will _not_ match `"/^solid/"` (notice beginning of the line boundary) but _will_ match `"/\\s+solid\\s+/"` or `"/\\bsolid\\b/"`.

Be careful with regex matching not to accidentally consider quoted string values and `url()` arguments. For example, `"/red/"` will match value such as `"1px dotted red"` as well as `"\"red\""` and `"white url(/mysite.com/red.png)"`.

Given:

```json
{
  "declaration-property-value-allowed-list": {
    "/^(-webkit-)?transform$/": ["/scale/"],
    "whitespace": ["nowrap"],
    "/color/": ["/^green/"]
  }
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { whitespace: pre; }
```

<!-- prettier-ignore -->
```css
a { transform: translate(1, 1); }
```

<!-- prettier-ignore -->
```css
a { -webkit-transform: translate(1, 1); }
```

<!-- prettier-ignore -->
```css
a { color: pink; }
```

<!-- prettier-ignore -->
```css
a { background-color: pink; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { whitespace: nowrap; }
```

<!-- prettier-ignore -->
```css
a { transform: scale(1, 1); }
```

<!-- prettier-ignore -->
```css
a { -webkit-transform: scale(1, 1); }
```

<!-- prettier-ignore -->
```css
a { color: green; }
```

<!-- prettier-ignore -->
```css
a { background-color: green; }
```
