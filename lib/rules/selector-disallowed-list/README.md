# selector-disallowed-list

Specify a list of disallowed selectors.

<!-- prettier-ignore -->
```css
    .foo > .bar {}
/** ↑
 * This is selector */
```

## Options

### `Array<string>`

```json
["array", "of", "selectors", "/regex/"]
```

Given:

```json
{
  "selector-disallowed-list": ["a > .foo", "/\\[data-.+]/"]
}
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

### `splitList`

Split selector lists into individual selectors. Defaults to `false`.

Given:

```json
{
  "selector-disallowed-list": [".foo", { "splitList": true }]
}
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

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"inside-block"`

Ignore selectors that are inside a block.

Given:

```json
{
  "selector-disallowed-list": [".foo", { "ignore": ["inside-block"] }]
}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
.bar {
  .foo {}
}
```

#### `"keyframe-selectors"`

Ignore keyframe selectors.

Given:

```json
{
  "selector-disallowed-list": ["/from/", { "ignore": ["keyframe-selectors"] }]
}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
@keyframes fade-in {
  from {}
}
```
