# Commit Message Guidelines

As an AI agent, you must follow these rules when suggesting or performing git commits in this repository. These rules are derived from the Conventional Commits specification, the project's emoji mapping, and `claude.md`.

## Format
Messages must follow the **Conventional Commits** specification:
`<type>(<scope>): <emoji> <subject>`

- **Type**: Must be one of the allowed types (see below).
- **Scope**: Optional. Use when the change is specific to a component or module (e.g., `deps`, `auth`, `ui`).
- **Emoji**: **MANDATORY**. You MUST include the exact project-mapped emoji right after the colon (e.g., `feat: ✨ subject`).
- **Subject**: 
    - Use imperative, present tense (e.g., "add" not "added").
    - Case-insensitive (but meaningful).
    - No period (`.`) at the end.
    - **Length**: The TOTAL header line (type + scope + emoji + subject) MUST NOT exceed 100 characters. If the description is too long, truncate it or move details to the body.

## Types and Emojis
| Type | Emoji | Description |
| :--- | :--- | :--- |
| `feat` | ✨ | A new feature |
| `fix` | 🐛 | A bug fix |
| `docs` | 📚 | Documentation only changes |
| `style` | 💎 | Changes that do not affect code meaning (formatting, etc) |
| `refactor` | 📦 | A code change that neither fixes a bug nor adds a feature |
| `perf` | ⚡ | A code change that improves performance |
| `test` | 🧪 | Adding or updating tests |
| `chore` | 🔧 | Changes to build process, dependencies, or tooling |
| `ci` | ⚙️ | Changes to CI configuration |
| `revert` | ⏮️ | Reverts a previous commit |

## Examples
- `feat(map): ✨ add support for AMap links`
- `fix(ui): 🐛 correct alignment on mobile devices`
- `chore: 🔧 update dependencies`
- `docs: 📚 update installation steps in README`

## Verification
Before committing, ensure the message follows the Conventional Commits rules and the project's emoji guidelines. Avoid generic messages like "update files" or "fix bugs".
