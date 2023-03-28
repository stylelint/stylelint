# rule-selector-property-disallowed-list

Specify a list of disallowed properties for selectors within rules.

<!-- prettier-ignore -->
```css
    a { color: red; }
/** ↑   ↑
 * Selector and property name */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`object`: `{ "selector": ["array", "of", "properties", "/regex/", /regex/]|"property"|"/regex/"|/regex/`

If a selector name is surrounded with `"/"` (e.g. `"/anchor/"`), it is interpreted as a regular expression. This allows, for example, easy targeting of all the potential anchors: `/anchor/` will match `.anchor`, `[data-anchor]`, etc.

The same goes for properties. Keep in mind that a regular expression value is matched against the entire property name, not specific parts of it. For example, a value like `"animation-duration"` will _not_ match `"/^duration/"` (notice beginning of the line boundary) but _will_ match `"/duration/"`.

Given:

```json
{
  "a": ["color", "/margin/"],
  "/foo/": "/size/"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: red; }
```

<!-- prettier-ignore -->
```css
a { margin-top: 0px; }
```

<!-- prettier-ignore -->
```css
html[data-foo] { font-size: 1px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { background: red; }
```

<!-- prettier-ignore -->
```css
a { padding-top: 0px; }
```

<!-- prettier-ignore -->
```css
html[data-foo] { color: red; }
```
