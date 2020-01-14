# Get started

First, decide how you want to use stylelint:

-   [on the command line](usage/cli.md)
-   [in your text editor](integrations.md#editor-plugins), for example in VS Code
-   [in for your build tool](integrations.md#build-tool-plugins), for example in webpack
-   [via the Node.js API](usage/node-api.md)
-   [as a PostCSS plugin](usage/postcss-plugin.md)

Then create your [configuration object](configuration/configuration.md). You can either extend a shared configuration or craft your own.

## Extend a shared configuration

This is the quickest way to get started. We suggest you extend either:

-   [`stylelint-config-recommended`](https://github.com/stylelint/stylelint-config-recommended)
-   [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard)

The recommended config turns on just the [possible error](configuration/rules.md#possible-errors) rules. The standard config extends it by turning on 60 [stylistic rules](configuration/rules.md#stylistic-issues). We suggest you extend the:

-   recommended config if you use a pretty printer like [prettier](https://prettier.io/)
-   standard config if you want stylelint to enforce stylistic conventions

You may want to add rules to your config that [limit language features](configuration/rules.md#limit-language-features) as these will be specific to your team and/or project.

*If you use language extensions, for example `@if` and `@extends`, you can use a community config like [`stylelint-config-recommended-scss`](https://github.com/kristerkari/stylelint-config-recommended-scss) instead.*

## Craft your own config

Alternatively, you can [learn about the rules](configuration/about-rules.md) and then either:

-   start small and add only [the rules](configuration/rules.md) you want to turn on
-   copy, paste and adapt [this example configuration](configuration/example-config.md) which lists all of the rules and their primary options
