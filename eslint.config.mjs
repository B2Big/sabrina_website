import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Fichiers générés par next-pwa (service worker + workbox) :
    "public/sw.js",
    "public/workbox-*.js",
    // Ancien dossier mort référencé par l'ancien .eslintignore :
    "run-app-native/**",
  ]),
  {
    // Règle contestée et inadaptée à un site français : les apostrophes et
    // guillemets typographiques dans le texte JSX sont voulus (pas des erreurs).
    rules: {
      "react/no-unescaped-entities": "off",
      // Dette technique assumée (audit 2026-09-05) : 27 `any` à typer, 4 scripts
      // legacy en require(), 4 setState d'initialisation dans des effects.
      // Rétrogradés en warnings : visibles dans le lint, non bloquants au build.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
