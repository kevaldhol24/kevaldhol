import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["build/**", ".react-router/**", "node_modules/**", "app/generated/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11yPlugin,
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/jsx-no-leaked-render": ["warn", { validStrategies: ["ternary"] }],
      "react-hooks/rules-of-hooks": "error",
      "jsx-a11y/no-autofocus": "off",
      "@typescript-eslint/consistent-type-definitions": 0,
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // Relative imports are banned in favor of the ~/ alias, except:
              // - "./+types/..." — React Router's per-route generated types, always
              //   same-directory, no ~/ alias exists for them.
              // - "./app.css" / other same-directory asset imports (e.g. root.tsx).
              regex: "^\\.\\.?/(?!\\+types/)(?!.*\\.css$).*",
              message: "Use the ~/ path alias instead of a relative import.",
            },
          ],
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    // Route-config files (`routes.ts`, each module's `routes/index.ts`) load in a separate,
    // minimal Vite environment before the app's `~/` alias is available — an aliased import
    // there fails to resolve at runtime. These must stay relative. See CLAUDE.md.
    files: ["app/routes.ts", "app/modules/*/routes/index.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  }
);
