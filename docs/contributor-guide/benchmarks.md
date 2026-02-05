# Benchmarking

You can use our benchmarking tools to measure the impact of your performance-related code changes or to ensure you don't introduce any performance regressions when making other changes.

Use:

- [rule benchmarking](#rule-benchmarking) to measure the performance of individual rules
- [system benchmarking](#system-benchmarking) to measure overall performance across realistic workspaces

## Rule benchmarking

A Stylelint rule can repeat its core logic many, many times (e.g. checking every value node of every declaration in a vast CSS codebase). So it's worth paying attention to performance and doing what we can to improve it!

Improving the performance of a rule is a great way to contribute if you want a quick little project. Try picking a rule and seeing if there's anything you can do to speed it up. Make sure you include benchmark measurements in your pull request!

### Getting started

You can run a benchmark on any given rule with any valid config using:

```shell
npm run benchmark-rule -- ruleName ruleOptions [config]
```

For example:

```shell
npm run benchmark-rule -- value-keyword-case lower
```

If the `ruleOptions` or `config` arguments are anything other than a string or a boolean, they must be valid JSON wrapped in quotation marks. For example:

```shell
npm run benchmark-rule -- value-keyword-case '["lower", {"camelCaseSvgKeywords": true}]' '{"fix": true}'
```

### Interpreting results

It will end up printing some simple stats like this:

```shell
Warnings: 1441
Mean: 74.17598357142856 ms
Deviation: 16.63969674310928 ms
```

Compare the results with those of:

- a similar rule when writing new rules
- the `main` branch when changing existing rules

### Implementation details

The script loads Bootstrap's CSS (from its CDN) and runs it through the configured rule.

## System benchmarking

The system benchmarking tool measures Stylelint's overall CLI and Node.js API performance across realistic workspaces of varying sizes.

### Getting started

You can compare against a baseline using:

```shell
# Run benchmarks and save a baseline result.
npm run benchmark -- --save=baseline.json

# Make changes or switch branches, then compare.
npm run benchmark -- --compare=baseline.json
```

If you already have two benchmark files, you can compare them without running any benchmarks:

```shell
npm run benchmark -- --compare=baseline.json --compare-to=after.json
```

To view a saved benchmark file:

```shell
npm run benchmark -- --show=baseline.json
```

### Options

| Option                              | Description                                                                                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--sizes=small,medium,large,xlarge` | Which workspace sizes to test.                                                                                                                        |
| `--iterations=N`                    | Measured iterations per benchmark. Default is 10.                                                                                                     |
| `--warmup=N`                        | Warmup iterations to discard. Default is 2.                                                                                                           |
| `--modes=api,cli`                   | Comma-separated list of modes to test. Running both modes, which is the default, is intended to help identify performance regressions in either mode. |
| `--save=FILE`                       | Save results to JSON.                                                                                                                                 |
| `--show=FILE`                       | Display results from a saved JSON file.                                                                                                               |
| `--compare=FILE`                    | Compare against baseline.                                                                                                                             |
| `--compare-to=FILE`                 | Compare `--compare` file against this file directly without running benchmarks.                                                                       |
| `--benchmark-only`                  | Skip workspace generation.                                                                                                                            |

### Interpreting results

#### Summary

```text
──────────────────────────────────────────────────────────────────────────────────────────
Size      Files   API time    ±CV    /file     CLI time    ±CV    /file
──────────────────────────────────────────────────────────────────────────────────────────
Small     20      32.96ms     32.1%  1.65ms    331.55ms    15.2%  16.58ms
Medium    100     191.33ms    10.1%  1.91ms    551.01ms    12.2%  5.51ms
Large     500     1.33s       3.7%   2.66ms    1.77s       7.1%   3.55ms
X-Large   1000    4.79s       9.4%   4.79ms    5.72s       3.4%   5.72ms
──────────────────────────────────────────────────────────────────────────────────────────
```

- **Time**: mean with the top and bottom 10% of iterations removed for stability.
- **±CV**: coefficient of variation, which measures how consistent the results are. Lower is better.
- **/file**: time per file. If this increases significantly for larger workspaces, it may indicate a performance issue. Higher values at small sizes can be explained by fixed overheads, such as process startup time.

#### Comparisons

```text
────────────────────────────────────────────────────────────────────────────
Size      Baseline    Current     Diff        Change    Status
────────────────────────────────────────────────────────────────────────────
Small     265.98ms    331.55ms    +65.57ms    +24.7%    ✗ Slower
Medium    563.36ms    551.01ms    12.35ms     -2.2%     ≈ Same
Large     1.81s       1.77s       39.93ms     -2.2%     ≈ Same
X-Large   5.63s       5.72s       +97.60ms    +1.7%     ≈ Same
────────────────────────────────────────────────────────────────────────────
```

The significance threshold is dynamic based on the coefficient of variation (CV) of both baseline and current runs. If the CV is high, indicating noisy measurements, the threshold is raised to avoid false positives.

- **✓ Faster**: improvement beyond the CV-based threshold
- **✗ Slower**: regression beyond the CV-based threshold
- **≈ Same**: within measurement noise

### Tips

You can:

- close other applications and avoid running on battery power for the most reliable results
- increase `--iterations` or reduce system load if you see a high CV of over 15%, which indicates noisy measurements
- use `--sizes=small,medium,large` for faster feedback (the `xlarge` size is useful for stress testing, but takes longer to run)

### Implementation details

The tool:

- discards warmup iterations to account for JIT compilation and cache warming
- removes the top and bottom 10% of iterations using a trimmed mean to reduce the impact of outliers

And simulates the following workspace sizes:

| Size   | Files | Rules | Overrides | Plugins | Simulates                                     |
| ------ | ----- | ----- | --------- | ------- | --------------------------------------------- |
| small  | 20    | 10    | 0         | 0       | Personal site or small library                |
| medium | 100   | 25    | 10        | 2       | Moderately-sized product or component library |
| large  | 500   | 50    | 50        | 5       | Enterprise app or design system               |
| xlarge | 1000  | 80    | 200       | 8       | Huge, sprawling monorepo                      |
