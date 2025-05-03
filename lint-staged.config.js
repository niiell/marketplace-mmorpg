module.exports = {
  '*.{ts,tsx,css}': [
    'prettier --write',
    'eslint --fix',
    'git add'
  ],
};
