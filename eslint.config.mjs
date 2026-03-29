import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  { ignores: ['dist', 'node_modules', 'build', 'coverage'] },
  {
    files: ['**/*.{js,mjs,cjs}'],
    // plugins: { js },
    // extends: ['js/recommended'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: globals.browser,
    },
    ...js.configs.recommended,
  },
  prettier,
]);
