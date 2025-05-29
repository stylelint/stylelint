# declaration-property-unit-disallowed-list

Specify a list of disallowed property and unit pairs within declarations.

<!-- prettier-ignore -->
```css
a { width: 100px; }
/** ↑         ↑
 * These properties and these units */
```

## Options

### `Object<string, Array<string>>`

```json
{ "unprefixed-property-name": ["array", "of", "units"] }
```

You can specify a regex for a property name, such as `{ "/^animation/": [] }`.

Given:

```json
{
  "declaration-property-unit-disallowed-list": {
    "font-size": ["em", "px"],
    "/^animation/": ["s"]
  }
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { font-size: 1em; }
```

<!-- prettier-ignore -->
```css
a { animation: animation-name 5s ease; }
```

<!-- prettier-ignore -->
```css
a { -webkit-animation: animation-name 5s ease; }
```

<!-- prettier-ignore -->
```css
a { animation-duration: 5s; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-size: 1.2rem; }
```

<!-- prettier-ignore -->
```css
a { height: 100px; }
```

<!-- prettier-ignore -->
```css
a { animation: animation-name 500ms ease; }
```

<!-- prettier-ignore -->
```css
a { -webkit-animation: animation-name 500ms ease; }
```

<!-- prettier-ignore -->
```css
a { animation-duration: 500ms; }
```
