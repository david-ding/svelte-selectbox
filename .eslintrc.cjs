module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      files: ["*.svelte", "*.ts"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
      ],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/no-inferrable-types": 0,
        "comma-dangle": ["error", "always-multiline"],
        indent: ["error", 2, { SwitchCase: 1 }],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
      },
    },
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
      plugins: ["svelte3", "@typescript-eslint"],
    },
  ],
  ignorePatterns: ["*.cjs"],
  settings: {
    "svelte3/typescript": () => require("typescript"),
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2019,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
