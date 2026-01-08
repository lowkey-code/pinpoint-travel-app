export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'revert',
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100],
  },
  prompt: {
    questions: {
      type: {
        description:
          "Select the type of change that you're committing:\n  feat:     A new feature\n  fix:      A bug fix\n  docs:     Documentation only changes\n  style:    Changes that do not affect code meaning (formatting, missing semicolons, etc)\n  refactor: A code change that neither fixes a bug nor adds a feature\n  perf:     A code change that improves performance\n  test:     Adding or updating tests\n  chore:    Changes to build process, dependencies, or tooling",
        enum: {
          feat: {
            description: 'A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: 'Documentation only changes',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description:
              'Changes that do not affect code meaning (formatting, missing semicolons, etc)',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: 'A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: 'A code change that improves performance',
            title: 'Performance Improvements',
            emoji: '⚡',
          },
          test: {
            description: 'Adding or updating tests',
            title: 'Tests',
            emoji: '🧪',
          },
          chore: {
            description: "Changes to build process, dependencies, or tooling",
            title: 'Chores',
            emoji: '🔧',
          },
          ci: {
            description: 'Changes to CI configuration files and scripts',
            title: 'CI',
            emoji: '⚙️',
          },
          revert: {
            description: 'Reverts a previous commit',
            title: 'Reverts',
            emoji: '⏮️',
          },
        },
      },
      scope: {
        description:
          'What is the scope of this change (e.g. component name, feature area)?',
        default: '',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the changes',
        default: '',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
        default: false,
      },
      breakingBody: {
        description:
          'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
        default: '',
      },
      breaking: {
        description: 'Describe the breaking changes',
        default: '',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
        default: false,
      },
      issuesBody: {
        description:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
        default: '',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "closes #123")',
        default: '',
      },
    },
  },
};
