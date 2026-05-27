import type { ITtscLintConfig } from "@ttsc/lint";

export default {
  format: {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    trailingComma: "all",
    importOrder: [
      "<THIRD_PARTY_MODULES>",
      "^@samchon/shopping-api(.*)$",
      "^[./]",
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
  },
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
    "typescript/prefer-as-const": "error",
    "typescript/prefer-namespace-keyword": "error",
  },
} satisfies ITtscLintConfig;
