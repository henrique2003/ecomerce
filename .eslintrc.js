module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/space-before-blocks': 'off',
    '@typescript-eslint/no-misused-promises': 'off'
  }
}
