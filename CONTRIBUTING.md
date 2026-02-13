# Contributing to create-rag-app

First off, thank you for taking the time to contribute! 🎉 Contributions make open source stronger, and we appreciate your support.

This document explains how to contribute to create-rag-app.

## 📌 Ways to Contribute
You can contribute by:
- Reporting bugs
- Suggesting new features
- Improving documentation
- Fixing typos
- Adding new templates
- Improving CLI experience
- Adding support for more LLM providers / vector databases
- Writing tests

## 🐛 Reporting Bugs
If you find a bug, please open an issue and include:
- What you expected to happen
- What actually happened
- Steps to reproduce the issue
- Your environment:
  - OS (Windows/Linux/macOS)
  - Node.js version
  - npm version

## 💡 Feature Requests
If you have an idea, open an issue with:
- What feature you want
?
- Why it’s useful
?
- Any example or reference
?

## 🛠️ Local Development Setup
1. **Fork the repository**
   - Click Fork on GitHub and clone your fork:
```bash
git clone https://github.com/itwaasyou/create-rag-app.git
git cd create-rag-app
```
2. **Install dependencies**
```bash
npm install
```
3. **Run the CLI locally**
   - You can test the CLI without publishing by running:
```bash
node bin/cli.js
```
   - Or link it globally:
```bash
npm link \
create-rag-app test-project
```

## 📂 Project Structure
directory structure of the project:
| File/Folder | Description |
|--------------|--------------|
| `bin/cli.js` | CLI entry point |
| `src/` | Main scaffolding logic, prompts, utils |
| `templates/` | Default template project |
| `README.md` | Documentation |

# 📦 Adding a New Template

Templates are stored in:

```
templates/
```

## To add a new template:

1. Create a new folder:

   ```
   templates/<template-name>
   ```

2. Add required project files (`package.json`, `src/`, etc.)
3. Update prompt options in:

   ```
   src/prompts.js
   ```
4. Make sure the template works by testing:

   ```
   node bin/cli.js
   ```

# 🧪 Testing Your Changes

After editing code, test the CLI by generating a project:

```bash
node bin/cli.js
```

Then go inside the generated folder and run:

```bash
npm run dev
```

If the template includes ingestion, run:

```bash
npm run ingest
```

# 🧹 Code Style 
Please follow these guidelines:
- Use clean and readable code.
- Keep functions small and reusable.
- Use consistent formatting.
- Prefer async/await instead of callbacks.
- Keep CLI output user-friendly.

# 📝 Commit Message Guidelines 
Use meaningful commit messages:
- ✅ Good examples:
  - `fix: resolve chroma url bug`
  - `feat: add ollama provider support`
  - `docs: update readme installation steps`
- ❌ Bad examples:
  - `update`
  - `fix`
  - `done`

# 🚀 Submitting a Pull Request

## Create a new branch:

```bash
git checkout -b feature/my-feature
```

## Commit your changes:

```bash
git add .
git commit -m "feat: add new provider"
```

## Push to your fork:

```bash
git push origin feature/my-feature
```

## Open a Pull Request on GitHub.

---

## ✅ Pull Request Checklist

**Before submitting:**
- Code works locally
- Template runs successfully
- No unnecessary files included
- Documentation updated (if required)
- PR has a clear title and description

---

## 🤝 Community Guidelines
This project follows the [Code of Conduct](https://github.com/itwaasyou/create-rag-app?tab=coc-ov-file).
By contributing, you agree to follow it.

---

## 📬 Need Help?
If you're stuck, feel free to open an issue or start a discussion.
