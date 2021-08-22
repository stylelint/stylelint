# rule-selector-property-disallowed-list

Specify a list of disallowed properties for selectors within rules.

<!-- prettier-ignore -->
```css
    html.custom { background-color: red; }
/** ↑             ↑
 * Selector and property name */
```

## Options

`object`: `{ "selector": ["array", "of", "properties"]`

If a selector name is surrounded with `"/"` (e.g. `"/anchor/"`), it is interpreted as a regular expression. This allows, for example, easy targeting of all the potential anchors: `/anchor/` will match `.anchor`, `[data-anchor]`, etc.

The same goes for properties. Keep in mind that a regular expression value is matched against the entire property name, not specific parts of it. For example, a value like `"animation-duration"` will _not_ match `"/^duration/"` (notice beginning of the line boundary) but _will_ match `"/duration/"`.

Given:

```json
{
  "a": ["background-color"],
  "html": ["/color/"],
  "/test/": ["/size/"]
}
```

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
a { background-color: red; }
```

<!-- prettier-ignore -->
```css
html { background-color: red; }
```

<!-- prettier-ignore -->
```css
html[data-test] { font-size: 1px; }
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
a { background: red; color: red; }
```

<!-- prettier-ignore -->
```css
a[href="#"] { background-color: red; }
```

<!-- prettier-ignore -->
```css
html[data-test] { background-color: red; }
```
