// Flat ESLint config for the ttsc benchmark (B3): the auto-fixable subset of
// the shared lint rules, matching @ttsc/lint's enabled rule set.
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["src/**/*.ts", "test/**/*.ts"],
    ignores: ["src/api/functional/**"],
    linterOptions: { reportUnusedDisableDirectives: "off" },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: "error",
      "object-shorthand": "error",
      "no-unneeded-ternary": "error",
      "prefer-template": "error",
      "no-useless-rename": "error",
      "dot-notation": "error",
      "no-extra-boolean-cast": "error",
      "no-useless-escape": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
    },
  },
];
