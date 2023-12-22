# selector-disallowed-list

Specify a list of disallowed selectors.

<!-- prettier-ignore -->
```css
    .foo > .bar
/** ↑
 * This is selector */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string|regexp`: `["array", "of", "selectors", /or/, "/regex/"]|"selector"|"/regex/"|/regex/`

If a string is surrounded with `"/"` (e.g. `"/\.foo/"`), it is interpreted as a regular expression.

Given:

```json
["a > .foo", "/\\[data-.+]/"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a > .foo {}
```

<!-- prettier-ignore -->
```css
a[data-auto="1"] {}
```

<!-- prettier-ignore -->
```css
.foo, [data-auto="1"] {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
.foo {}
```

<!-- prettier-ignore -->
```css
a
>
.foo {}
```

<!-- prettier-ignore -->
```css
.bar > a > .foo {}
```

<!-- prettier-ignore -->
```css
.data-auto {}
```

<!-- prettier-ignore -->
```css
a[href] {}
```

## Optional secondary options

### `splitList: true | false` (default: `false`)

Split selector lists into individual selectors.

For example, with `true`.

Given:

```json
[".foo", { "splitList": true }]
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
.bar, .foo {}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
.bar .foo {}
```

### `ignore: ["inside-block"]`

Ignore selectors that are inside a block.

Given:

```json
[".foo", { "ignore": ["inside-block"] }]
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
.bar {
  .foo {}
}
```

### `ignore: ["keyframe-selectors"]`

Ignore keyframe selectors.

Given:

```json
["/from/", { "ignore": ["keyframe-selectors"] }]
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
@keyframes fade-in {
  from {}
}
```
