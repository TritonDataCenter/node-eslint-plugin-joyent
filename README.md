<!--
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<!--
    Copyright 2017, Joyent, Inc.
-->

# node-eslint-plugin-joyent

This repository is part of the Joyent Manta and Triton projects. For
contribution guidelines, issues, and general documentation, visit the main
[Triton](https://github.com/joyent/triton) and
[Manta](https://github.com/joyent/manta) project pages.

## Overview

This is a plugin for [ESLint](http://eslint.org) that is meant to provide
default style and lint configurations that approximate what Joyent
repositories using [jsstyle](https://github.com/davepacheco/jsstyle) and
[JavaScript Lint](http://javascriptlint.com/) currently do. ESLint is highly
configurable, so additional capabilities can be turned on or disabled locally
where desired.

Note that this can't yet be used as a full replacement for `jsstyle`, since
ESLint's `indent` setting doesn't do a good job of accounting for line
continuations. Using the style configuration is still useful though, since it
does catch a number of other issues.

## Setup

To use this repo, place the following in your `package.json`:

```json
"devDependencies": {
    "eslint": "4.13.1",
    "eslint-plugin-joyent": "~2.0.0"
    ...
},
```

You'll then want to update your `Makefile` to include the following:

```
ESLINT		= ./node_modules/.bin/eslint
ESLINT_FILES	= $(JS_FILES)

...

$(ESLINT): | $(NPM_EXEC)
	$(NPM) install

.PHONY: check
check:: $(ESLINT)
	$(ESLINT) $(ESLINT_FILES)
```

And create `.eslintrc`:

```json
{
    "plugins": [ "joyent" ],
    "extends": [
        "eslint:recommended",
        "plugin:joyent/style",
        "plugin:joyent/lint"
    ],
    "parserOptions": {
        "ecmaVersion": 5,
        "sourceType": "script",
        "ecmaFeatures": {
        }
    },
    "env": {
        "node": true
    },
    "rules": {
        // Local rule configuration can go here 
    }
}
```
