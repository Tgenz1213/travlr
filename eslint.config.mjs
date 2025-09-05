import globals from "globals";

import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";
import tsparser from "@typescript-eslint/parser";

const commonRules = {
  "@stylistic/semi": ["error", "always"],
  "@stylistic/no-extra-semi": "off",
  "@stylistic/semi-style": ["error", "last"],
  "@stylistic/object-curly-newline": ["error", {
    ObjectExpression: { multiline: true, minProperties: 3 },
    ObjectPattern: { multiline: true, minProperties: 3 },
    ImportDeclaration: "never",
    ExportDeclaration: { multiline: true, minProperties: 3 }
  }],
  "@stylistic/object-curly-spacing": ["error", "always"],
  "@stylistic/no-trailing-spaces": "error",
  "@stylistic/spaced-comment": ["error", "always"],
  "@stylistic/quotes": ["error", "double"],
  "@stylistic/indent": ["error", 2],
  "@stylistic/comma-dangle": ["error", "never"],
  "prefer-const": "error",
  "no-unreachable": "error",
  "eqeqeq": "error"
};

export default tseslint.config(
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      sourceType: "module"
    }
  },
  stylistic.configs["recommended-flat", "disable-legacy"],
  ...tseslint.configs.recommended,
  {
    plugins: { "@stylistic": stylistic, "typescript-eslint": tseslint },
    rules: commonRules
  },
  {
    files: ["./app_admin/src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.__dirname
      },
      parser: tsparser
    }
  },
  {
    files: ["*.mjs"],
    ...tseslint.configs.disableTypeChecked,
    rules: commonRules
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "script" },
    ...tseslint.configs.disableTypeChecked,
    rules: {
      ...commonRules,
      "@typescript-eslint/no-var-requires": "off"
    }
  }
);
