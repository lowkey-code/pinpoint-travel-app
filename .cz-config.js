module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature ✨' },
    { value: 'fix', name: 'fix:      A bug fix 🐛' },
    { value: 'docs', name: 'docs:     Documentation only changes 📚' },
    { value: 'style', name: 'style:    Changes that do not affect code meaning 💎' },
    { value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature 📦' },
    { value: 'perf', name: 'perf:     A code change that improves performance ⚡' },
    { value: 'test', name: 'test:     Adding or updating tests 🧪' },
    { value: 'chore', name: 'chore:    Changes to build process, dependencies, or tooling 🔧' },
    { value: 'ci', name: 'ci:       Changes to CI configuration files and scripts ⚙️' },
    { value: 'revert', name: 'revert:   Reverts a previous commit ⏮️' },
  ],
  scopes: [],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'refactor', 'perf'],
};
