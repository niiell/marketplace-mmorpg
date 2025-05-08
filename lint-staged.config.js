module.exports = {
  '*.{ts,tsx,css}': [
    'prettier --write',
    'eslint --fix',
    'git add',
    'git commit -m "Format and lint files"',
  ],
};