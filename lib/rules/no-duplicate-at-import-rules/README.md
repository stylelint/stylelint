# no-duplicate-at-import-rules

Disallow duplicate `@import` rules within a stylesheet.

```css
    @import "a.css";
    @import "a.css";
/** ↑
 * These are duplicates */
```

## Options

### `true`

The following patterns are considered violations:

```css
@import 'a.css';
@import 'a.css';
```

```css
@import url("a.css");
@import url("a.css");
```

```css
@import "a.css";
@import 'a.css';
```

```css
@import "a.css";
@import 'b.css';
@import url(a.css);
```

The following patterns are *not* considered violations:

```css
@import "a.css";
@import "b.css";
```

```css
@import url('a.css') projection;
@import url('a.css') tv;
```
