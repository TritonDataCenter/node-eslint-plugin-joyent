module.exports = {
    "rules": {
        // Enforce semicolons
        "semi": "error",
        "no-extra-semi": "error",

        // Spacing rules 
        "key-spacing": "error",
        "keyword-spacing": "error",
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "always",
                "named": "never"
            }
        ],
        "space-in-parens": [ "error", "never" ],
        "no-spaced-func": "error",
        "no-whitespace-before-property": "error",
        "semi-spacing": "error",
        "space-unary-ops": "error",
        "space-before-blocks": "error",
        "spaced-comment": "error",
        "space-infix-ops": "error",
        "block-spacing": "error",
        "comma-spacing": "error",
        "no-trailing-spaces": "error",
        "no-multi-spaces": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 5,
                "maxEOF": 0
            }
        ],
        "padded-blocks": [ "error", "never" ],

        // Additional code layout rules
        "brace-style": [
            "error",
            "1tbs",
            { "allowSingleLine": true }
        ],
        "comma-style": "error",
        "one-var-declaration-per-line": "error",
        "operator-linebreak": [
            "error",
            "after",
            {
                "overrides": {
                    "+": "ignore",
                    "?": "ignore",
                    ":": "ignore"
                }
            }
        ],
        "dot-location": [
            "error",
            "property"
        ],

        // Other
        "quotes": [ "error", "single" ],
        "no-useless-escape": "error",
        "object-shorthand": [ "error", "never" ],
        "new-parens": "error",
        "yoda": "error",
        "unicode-bom": "error",
        "max-len": [
            "error",
            80,
            {
                "tabWidth": 8,
                "ignoreComments": false,
                "ignoreTrailingComments": false,
                "ignoreUrls": true
            }
        ],
        "max-lines": [
            "error",
            {
                "max": 5000,
                "skipBlankLines": false,
                "skipComments": false
            }
        ],
    }
};

