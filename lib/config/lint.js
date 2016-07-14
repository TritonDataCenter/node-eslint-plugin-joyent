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
        "no-self-compare": "error",
        "no-dupe-keys": "error",
        "no-unreachable": "error",
        "consistent-return": "error",
        "no-use-before-define": [ "error", { "functions": false } ],

        // Encourage using or avoiding certain language features
        "no-sequences": "error",
        "no-implied-eval": "error",
        "no-with": "error",
        "eqeqeq": "error",
        "no-loop-func": "error",
    }
};
