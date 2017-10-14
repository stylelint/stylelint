# no-duplicate-at-import-rules

Disallow duplicate @import rules within a stylesheet.

```css
    @import "mystyle.css";@import "otherstyle.css";@import "mystyle.css";
/**         ↑                                              ↑
 * These are duplicates */
```
## Options

### `true`

The following patterns are considered violations:

```css
@import "mystyle.css";
@import "mystyle.css";
```

```css
@import url("mystyle.css");
@import url("mystyle.css");
```

```css
@import url("mystyle.css");
@import url("otherstyle.css");
@import url("mystyle.css");
```

```css
@import url("mystyle.css");
a { color: red };
@import url("mystyle.css");
```

The following patterns are *not* considered violations:

```css
@import "mystyle.css";
@import "otherstyle.css";
```
