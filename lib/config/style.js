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
        "no-spaced-func": "error",
        "no-whitespace-before-property": "error",
        "semi-spacing": "error",
        "space-unary-ops": "error",
        "space-before-blocks": "error",
        "spaced-comment": "error",
        "space-infix-ops": "error",
        "block-spacing": "error",
        "comma-spacing": "error",

        // Additional code layout rules
        "brace-style": [
            "error",
            "1tbs",
            { "allowSingleLine": true }
        ],
        "comma-style": "error",
        "one-var-declaration-per-line": "error",
        "object-curly-newline": [ "error", { "minProperties": 4 } ],

        // Other
        "quotes": [ "error", "single" ],
        "yoda": "error",
        "unicode-bom": "error",
        "max-len": [
            "error",
            80,
            {
                "ignoreComments": false,
                "ignoreTrailingComments": false
            }
        ],
    }
};
