# string-no-newline

Disallow invalid newlines within strings.

<!-- prettier-ignore -->
```css
a {
  content: "foo
    bar"; }/*  ↑
 *             ↑
 * The newline here */
```

[The spec](https://www.w3.org/TR/CSS2/syndata.html#strings) says this: "A string cannot directly contain a newline. To include a newline in a string, use an escape representing the line feed character in ISO-10646 (U+000A), such as '\A' or '\00000a'." And also: "It is possible to break strings over several lines, for aesthetic or other reasons, but in such a case the newline itself has to be escaped with a backslash (\\)."

This rule overlaps with:

- [`at-rule-descriptor-value-no-unknown`](../at-rule-descriptor-value-no-unknown/README.md)
- [`at-rule-prelude-no-invalid`](../at-rule-prelude-no-invalid/README.md)
- [`declaration-property-value-no-unknown`](../declaration-property-value-no-unknown/README.md)
- [`media-query-no-invalid`](../media-query-no-invalid/README.md)

We recommend configuring this rule so that it doesn't overlap.

## Options

### `true`

```json
{
  "string-no-newline": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  content: "foo
    bar";
}
```

<!-- prettier-ignore -->
```css
[title="something
is probably wrong"] {}
```

<!-- prettier-ignore -->
```css
a {
  font-family: "Times
    New
    Roman";
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  content: "foo\Abar";
}
```

<!-- prettier-ignore -->
```css
a {
  content: "foo\\nbar";
}
```

<!-- prettier-ignore -->
```css
[title="nothing\
  is wrong"] {}
```

<!-- prettier-ignore -->
```css
a {
  font-family: "Times New Roman";
}
```

## Optional secondary options

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"at-rule-preludes"`

Ignore strings in at-rule preludes.

```json
{
  "string-no-newline": [true, { "ignore": ["at-rule-preludes"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@import url('foo
.css');
```

#### `"declaration-values"`

Ignore strings in declaration values.

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  content: "foo
    bar";
}
```
