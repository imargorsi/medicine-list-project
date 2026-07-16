# ESLint + Prettier Setup (Reusable Template)

A production-style lint + format setup for **Next.js (App Router) + TypeScript + Tailwind v4**, using **ESLint 9 flat config**. Copy this into any new project and adjust the path alias.

Division of labour:

- **Prettier** owns formatting (spacing, quotes, line width, Tailwind class order).
- **ESLint** owns code quality + `import/order`. It does **not** format — `eslint-config-prettier` turns off every rule that would fight Prettier.

---

## 1. Install

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-import eslint-import-resolver-typescript prettier-plugin-tailwindcss
```

Assumes `eslint`, `eslint-config-next`, and `tailwindcss` are already present (they ship with `create-next-app`).

### Notes on choices (read before copying blindly)

- **No `eslint-plugin-tailwindcss`.** The stable v3 plugin does not support Tailwind v4. Class ordering is handled by **`prettier-plugin-tailwindcss`** instead (the officially recommended v4 approach).
- **No `eslint-config-standard`.** It isn't ESLint-9 / flat-config ready and only duplicates/conflicts with formatting that Prettier already owns. Next's `core-web-vitals` + `typescript` configs cover code quality.

---

## 2. `eslint.config.mjs` (flat config)

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { import: importPlugin },
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
        node: true,
      },
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
          ],
          "newlines-between": "always",
          pathGroups: [
            { pattern: "@/**", group: "internal", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  // TS/JSX gets full type info from the compiler — no-undef is redundant noise.
  { files: ["**/*.ts", "**/*.tsx"], rules: { "no-undef": "off" } },
  // Prettier LAST: disables formatting rules that would conflict.
  eslintConfigPrettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/components/ui/**", // generated shadcn primitives
  ]),
]);

export default eslintConfig;
```

Per-project knobs:

- Change the `@/**` pathGroup pattern if your alias differs (e.g. `@app/**`).
- Update `globalIgnores` for any other generated/vendored directories.

### Mapping from the classic `.eslintrc` template

| Old `.eslintrc` (eslintrc format)                           | Flat-config equivalent here                       |
| ----------------------------------------------------------- | ------------------------------------------------- |
| `"extends": ["next/core-web-vitals", "next/typescript"]`    | `...nextVitals`, `...nextTs`                      |
| `"extends": ["prettier"]`                                   | `eslintConfigPrettier` (kept **last**)            |
| `"plugins": ["import"]` + `import/order`                    | `plugins: { import }` + `rules["import/order"]`   |
| `"ignorePatterns": ["components/ui/**"]`                    | `globalIgnores([...])`                            |
| `"overrides"` → `no-undef: off` for `*.ts(x)`               | `{ files: ["**/*.ts","**/*.tsx"], rules: {...} }` |
| `"extends": ["standard", "plugin:tailwindcss/recommended"]` | Dropped — see notes above                         |

---

## 3. `.prettierrc.json`

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "arrowParens": "always",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## 4. `.prettierignore`

```
.next/
out/
build/
next-env.d.ts
node_modules/
package-lock.json
pnpm-lock.yaml
yarn.lock
src/components/ui/
```

---

## 5. Format / lint on save — `.vscode/settings.json`

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
  "eslint.useFlatConfig": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[javascriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[json]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[jsonc]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[css]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }
}
```

On save: **Prettier formats**, then **ESLint fixes** (`import/order` reordering, etc).

### `.vscode/extensions.json` (so teammates get the right extensions)

```json
{
  "recommendations": ["esbenp.prettier-vscode", "dbaeumer.vscode-eslint"]
}
```

---

## 6. `package.json` scripts

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

---

## 7. First run

```bash
npm run lint:fix   # reorders imports, applies fixable rules
npm run format     # formats the whole repo once
```

Commit that formatting pass on its own so future diffs stay clean. Add `npm run lint` and `npm run format:check` to CI to keep it enforced.
