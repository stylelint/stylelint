# Performing releases

The primary goals are:

1.  Publishing the updated package to npm.
2.  Creating a GitHub release with notes.

The secondary goals are:

1.  Ensuring the stylelint org's `stylelint-config-*` shareable configs are compatible with the release.
2.  Updating the online demo at [https://stylelint.io/demo](https://stylelint.io/demo) to use the release.
3.  Updating the documentation at [https://stylelint.io](https://stylelint.io) to use the release.
4.  Sending out a tweet.

## Process

1.  Locally test `master` in the `stylelint-config-*` shareable configs repos.
2.  Locally test `master` in the `stylelint.io` repo.
3.  Locally test `master` in the `stylelint-demo` repo.
4.  Both the publishing of the package to npm and the creating a github release are done with [`npmpub`](https://github.com/MoOx/npmpub):
    1.  Ensure the CHANGELOG is consistently formatted:
        -   If a CHANGELOG item affects only one rule, then it should lead with its name.
        -   The order of items is: Removed, Changed, Deprecated, Added, Fixed.
        -   The items within each group are ordered by the widest reaching first to the smallest, and then alphabetically by rule name.
    2.  Increment the `version` number in the `package.json` by hand, according to whether it's a patch, minor or major release.
    3.  Replace `# Head` in `CHANGELOG.md` with this new version number e.g. `# 8.1.2`
    4.  Commit and _push up_ these changes.
    5.  Go to [https://github.com/stylelint/stylelint](https://github.com/stylelint/stylelint) and confirm these changes are correct and pushed up.
    6.  Run `npm run dry-release`.
    7.  Run `npm run release`.
    8.  Go to [https://www.npmjs.com/package/stylelint](https://www.npmjs.com/package/stylelint) and confirm the package was published correctly.
    9.  Go to [https://github.com/stylelint/stylelint/releases](https://github.com/stylelint/stylelint/releases) and confirm the release was created correctly.
5.  If a new version of any `stylelint-config-*` is required, repeat step 3 for that repo.
6.  Update the online demo by changing to the `stylelint-demo` repo:
    1.  Run `npm install -S stylelint@latest`
    2.  Run `npm test`
    3.  Commit and _push up_ these changes.
    1.  Go to [https://stylelint.io/demo](https://stylelint.io/demo) and confirm the update was automatically deployed.
7.  Update the website documentation by changing the to `stylelint.io` repo:
    1.  Run `npm install -D stylelint@latest`
    2.  Run `npm test`
    3.  Commit and _push up_ these changes.
    4.  Run `npm run deploy`.
    5.  Go to [https://stylelint.io](https://stylelint.io) and confirm the update was deployed correctly.
8.  Compose a tweet that announces the release, communicates what has changed and links to the appropriate heading in the CHANGELOG on [https://stylelint.io](https://stylelint.io).
