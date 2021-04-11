# selector-disallowed-list

Specify a list of disallowed selectors

<!-- prettier-ignore -->
```css
    .foo > .bar
/** ↑
 * This is selector */
```

## Options

`string | regex | array of string and regex`

### Given the string:

```
"a > .foo"
```

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
a > .foo {}
```

The following patterns are _not_ considered violations:

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

### Given the regular expression:

```
/\[data-.+]/
```

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
a[data-auto="1"] {}
```

<!-- prettier-ignore -->
```css
a[data-auto] {}
```

<!-- prettier-ignore -->
```css
.foo, [data-auto="1"] {}
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
.foo > a {}
```

<!-- prettier-ignore -->
```css
.data-auto {}
```

<!-- prettier-ignore -->
```css
a[href] {}
```

### Given the array of strings and regular expressions:

```
['.foo, .bar', /\.foo.*>.*\.bar/]
```

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
.foo, .bar {}
```

<!-- prettier-ignore -->
```css
.foo>.bar {}
```

<!-- prettier-ignore -->
```css
.foo > .bar {}
```

<!-- prettier-ignore -->
```css
.foo > /*comment*/.bar {}
```

<!-- prettier-ignore -->
```css
.foo:hover > .bar {}
```

<!-- prettier-ignore -->
```css
.foo > a > .bar {}
```

<!-- prettier-ignore -->
```css
a, .foo > .bar {}
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
.foo > a {}
```

<!-- prettier-ignore -->
```css
.bar, a {}
```

<!-- prettier-ignore -->
```css
.bar {}
```

<!-- prettier-ignore -->
```css
.foo .bar {}
```
