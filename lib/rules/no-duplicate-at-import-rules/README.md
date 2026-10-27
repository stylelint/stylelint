# no-duplicate-at-import-rules

Disallow duplicate `@import` rules.

<!-- prettier-ignore -->
```css
    @import "a.css";
    @import "a.css";
/** ↑
 * These are duplicates */
```

You can use this rule to avoid importing a stylesheet more than once. Browsers apply it at each position, so a later copy can override the imports between them.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the duplicate URL.

## Options

### `true`

```json
{
  "no-duplicate-at-import-rules": true
}
```

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
