import { defineConfig } from "eslint";
import globals from "globals";
import promise from "eslint-plugin-promise";

export default defineConfig([
  {
    ignores: ["dist/", "node_modules/"],
  },
  {
    files: ["**/*.{js,mjs,cjs}", "./src/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
    plugins: { promise }, // ✅ Use the imported object instead of a string
    extends: ["eslint:recommended", "plugin:promise/recommended"],
    rules: {
      "promise/always-return": "error",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
      "promise/catch-or-return": "warn",
      "promise/no-nesting": "warn",
      "promise/no-new-statics": "error",
    },
  },
]);
