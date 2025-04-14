import { fixupConfigRules } from "@eslint/compat";
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactJsx from "eslint-plugin-react/configs/jsx-runtime.js";
import react from "eslint-plugin-react/configs/recommended.js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import ts from "typescript-eslint";
import eslintPrettier from "eslint-plugin-prettier";

export default [
  { languageOptions: { globals: globals.browser }, ignores: ["dist/", ".vscode/", ".husky/"] },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    plugins: {
      prettier: eslintPrettier
    },
    rules: {
      "prettier/prettier": "error",
      "max-lines": ["error", { max: 650, skipBlankLines: true, skipComments: true }]
    }
  },
  ...fixupConfigRules([
    {
      ...react,
      settings: {
        react: { version: "detect" }
      }
    },
    reactJsx
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  },
  {
    files: ["app/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: { ecmaVersion: "latest", sourceType: "module" }
    },
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            [
              "^react",
              "^react-router",
              "^@?\\w",
              "^(@|components)(/.*|$)",
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$"
            ],
            ["^.+\\.?(sc|sa|c|le)ss$"]
          ]
        }
      ]
    },
    settings: {
      "import/parsers": { espree: [".mjs", ".js", ".tsx", ".ts"] },
      "import/resolver": { node: true }
    }
  }
];
