# no-extra-semicolons

Disallow extra semicolons.

```css
a { color: pink;; }
/**             ↑
 *  This semicolons */
```

The following patterns are considered warnings:

```css
@import "x.css";;
```

```css
@import "x.css";
;
```

```css
.foo {
  color: pink;; 
}
```

```css
.foo {
  ;color: pink; 
}
```

```css
.foo {
  color: pink; 
  ;
}
```

```css
.foo {
  color: red;
}
;
.bar {
  color: white;
}
```

The following patterns are *not* considered warnings:

```css
@import "x.css";
```

```css
.foo {
  color: pink;
}
```
