module.exports = {
    "rules": {
        // Override eslint:recommended defaults
        "no-console": "off",

        // Enforce sane behaviour around this and objects
        "no-invalid-this": "error",
        "consistent-this": [ "error", "self" ],
        "no-new": "error",
        "no-new-wrappers": "error",
        "no-new-func": "error",
        "no-new-require": "error",
        "no-proto": "error",

        // Identifier-related rules
        "no-shadow": "error",
        "no-shadow-restricted-names": "error",
        "no-unused-vars": [
            "error",
            {
                // Track all unused identifiers
                "vars": "all",
                "args": "all",
                "caughtErrors": "all",
                // Don't warn on args that start with _, res or req
                "argsIgnorePattern": "^(_|res|req)",
                // Don't warn on catch or var identifiers that start with _
                "caughtIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }
        ],
        "no-redeclare": [
            "error",
            { "builtinGlobals": true }
        ],

        // Find things that are likely mistakes
        "callback-return": [
            "error",
            [ "callback", "cb", "cb2", "done", "next" ]
        ],
        "comma-dangle": "error",
        "curly": "error",
        "default-case": "error",
        "no-self-compare": "error",
        "no-dupe-keys": "error",
        "no-unreachable": "error",
        "consistent-return": "error",
        "no-use-before-define": [ "error", { "functions": false } ],
        "no-negated-in-lhs": "error",
        "no-unneeded-ternary": "error",
        "no-unused-expressions": "error",
        "no-return-assign": [ "error", "always" ],
        "no-floating-decimal": "error",
        "radix": [ "error", "always" ],

        // Encourage using or avoiding certain language features
        "no-array-constructor": "error",
        "no-eq-null": "error",
        "no-sequences": "error",
        "no-implied-eval": "error",
        "no-lone-blocks": "error",
        "no-multi-str": "error",
        "no-octal-escape": "error",
        "no-with": "error",
        "no-void": "error",
        "eqeqeq": "error",
        "no-loop-func": "error",

        // File level issues
        "eol-last": "error",
        "linebreak-style": [ "error", "unix" ],
    }
};
