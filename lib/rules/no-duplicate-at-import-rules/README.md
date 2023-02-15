# no-duplicate-at-import-rules

Disallow duplicate `@import` rules.

<!-- prettier-ignore -->
```css
    @import "a.css";
    @import "a.css";
/** ↑
 * These are duplicates */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@import 'a.css';
@import 'a.css';
```

<!-- prettier-ignore -->
```css
@import url("a.css");
@import url("a.css");
```

<!-- prettier-ignore -->
```css
@import "a.css";
@import 'a.css';
```

<!-- prettier-ignore -->
```css
@import "a.css";
@import 'b.css';
@import url(a.css);
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@import "a.css";
@import "b.css";
```

<!-- prettier-ignore -->
```css
@import url('a.css') projection;
@import url('a.css') tv;
```
