# rule-selector-property-disallowed-list

Specify a list of disallowed properties for selectors within rules.

<!-- prettier-ignore -->
```css
    a { color: red; }
/** ↑   ↑
 * Selector and property name */
```

## Options

### `Object<string, Array<string>>`

```json
{ "selector": ["array", "of", "properties", "/regex/"] }
```

You can specify a regex for a selector, such as `{ "/foo-/": [] }`.

Given:

```json
{
  "rule-selector-property-disallowed-list": {
    "a": ["color", "/margin/"],
    "/foo/": ["/size/"]
  }
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

## Optional secondary options

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"keyframe-selectors"`

Ignore keyframe selectors.

Given:

```json
{
  "rule-selector-property-disallowed-list": [
    { "/^[a-z]+$/": ["opacity"] },
    { "ignore": ["keyframe-selectors"] }
  ]
}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```
