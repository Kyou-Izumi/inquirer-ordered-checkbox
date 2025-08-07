# CI/CD Setup Guide

This repository includes automated CI/CD workflows for testing, building, and publishing your npm package.

## Workflows Overview

### 1. CI Workflow (`ci.yml`)
**Triggers**: Push to `main`/`develop`, Pull Requests to `main`
- Tests on Node.js 18.x, 20.x, 22.x
- Runs TypeScript compilation
- Validates package structure
- Ensures code quality

### 2. Auto-Publish Workflow (`auto-publish.yml`)
**Triggers**: When `package.json` version changes on `main` branch
- Automatically detects version bumps
- Builds and tests the package
- Publishes to npm
- Creates git tags

### 3. Release Workflow (`release.yml`)
**Triggers**: Manual tag creation (e.g., `v1.0.2`)
- Publishes to npm with the tagged version
- Creates GitHub releases

## Initial Setup

### 1. Configure npm Token
1. Go to [npmjs.com](https://www.npmjs.com) → Account → Access Tokens
2. Create a new **Automation** token
3. In your GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Add repository secret: `NPM_TOKEN` with your token value

### 2. Repository Settings
Ensure your repository has these permissions:
- **Settings → Actions → General → Workflow permissions**: "Read and write permissions"
- This allows workflows to create tags and releases

## Development Workflow

### Manual Publishing
```bash
# Bump version and publish manually
npm version patch  # or minor/major
git push && git push --tags
npm publish --access=public
```

### Automated Publishing
```bash
# Simply bump the version in package.json
npm version patch
git push

# The auto-publish workflow will:
# 1. Detect the version change
# 2. Run tests and build
# 3. Publish to npm
# 4. Create a git tag
```

### Creating Releases
```bash
# Create a tag to trigger release workflow
git tag v1.0.2
git push origin v1.0.2

# Or use GitHub UI to create a release
```

## Available Scripts

| Script                | Description                             |
| --------------------- | --------------------------------------- |
| `npm run build`       | Compile TypeScript                      |
| `npm run build:watch` | Watch mode compilation                  |
| `npm run test`        | Run interactive test                    |
| `npm run test:types`  | Type-check without emitting             |
| `npm run clean`       | Remove dist folder                      |
| `npm run release`     | Bump version, push, and trigger publish |

## Workflow Status

Check the **Actions** tab in your GitHub repository to monitor:
- ✅ CI status for all commits and PRs
- 📦 Automatic publishing status
- 🏷️ Release creation status

## Troubleshooting

### NPM_TOKEN Issues
- Ensure token has **Automation** type (not Classic)
- Check token hasn't expired
- Verify secret is named exactly `NPM_TOKEN`

### Permission Issues
- Enable "Read and write permissions" in Actions settings
- Ensure repository has admin access for the GitHub token

### Build Failures
- Check Node.js version compatibility (18+)
- Verify all dependencies are listed in package.json
- Review TypeScript compilation errors in Actions logs
