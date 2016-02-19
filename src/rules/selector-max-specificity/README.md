# selector-max-specificity

Limit the specificity of selectors.

````
.foo, #bar.baz span, #hoo { color: pink; }
/** ↑         ↑        ↑
 * These selectors */
````

# Options

`string`: Level of specificity allowed

Format is id,class,type as computed by the [W3C specificity calculator](https://www.w3.org/TR/selectors/#specificity)

For a visual representation of selector specificity, visit: [https://specificity.keegan.st](https://specificity.keegan.st)

For example, with "0,2,0":

The following patterns are considered warnings:

````
.thing .thing2 .thing3 {}
````

````
.thing .thing2 {
  .thing3 & {}
}
````

The following are __not__ considered warnings:

````
.thing div {}
````

````
.thing div {
  a {}
}
````
