import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";
import importPlugin from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ignores: ["dist", "src/data"]},
	{languageOptions: {globals: globals.browser}},
	pluginJs.configs.recommended,
	{
		plugins: {
			"@stylistic/js": stylisticJs,
			"import": importPlugin,
		},
		rules: {
			"import/extensions": [
				"error",
				"ignorePackages",
				{
					// Enforce explicit file extension on imports. It will work
					// locally without them but not on gh pages.
					"js": "always",
					"jsx": "always",
				}
			],
			"@stylistic/js/linebreak-style": ["error", "unix"],
			"@stylistic/js/brace-style": ["error", "1tbs"],
			"@stylistic/js/indent": ["error", "tab", {"SwitchCase": 1}],
			"@stylistic/js/no-trailing-spaces": "error",
			"@stylistic/js/no-multi-spaces": "error",
			"@stylistic/js/no-tabs": ["error", {allowIndentationTabs: true}],
			"@stylistic/js/no-multiple-empty-lines": ["error", {max: 2, maxBOF: 1, maxEOF: 1}],
			"@stylistic/js/no-whitespace-before-property": "error",
			"@stylistic/js/keyword-spacing": ["error", {"before": true, after: true}],
			"@stylistic/js/switch-colon-spacing": ["error", {"before": false, "after": true}],
			"@stylistic/js/space-infix-ops": "error",
			"@stylistic/js/key-spacing": ["error", {"beforeColon": false, "afterColon": true}],
			"@stylistic/js/block-spacing": "error",
			"@stylistic/js/space-before-function-paren": ["error", "never"],
			"@stylistic/js/space-unary-ops": ["error", {"words": true, "nonwords": false}],
			"@stylistic/js/space-before-blocks": "error",
			"@stylistic/js/function-call-spacing": ["error", "never"],
			"@stylistic/js/array-bracket-spacing": ["error", "never"],
			"@stylistic/js/object-curly-spacing": ["error", "never"],
			"@stylistic/js/space-in-parens": ["error", "never"],
			"@stylistic/js/comma-spacing": ["error", {"before": false, "after": true}],
			"@stylistic/js/arrow-spacing": ["error", {"before": true, "after": true}],
			"@stylistic/js/rest-spread-spacing": ["error", "never"],
			"@stylistic/js/semi": ["error", "always"],
			"@stylistic/js/quotes": ["error", "double", {"avoidEscape": true}],
			"no-duplicate-imports": "error",
			"no-console": ["error", {allow: ["error"]}],
		}
	},
];
