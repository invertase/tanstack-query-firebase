# Contributing to TanStack Query Firebase

Thank you for your interest in contributing to TanStack Query Firebase! This document provides guidelines and instructions for setting up the development environment and contributing to the project.

## Development Setup

### Prerequisites

- Node.js 20 or later
- pnpm 8.15.4 or later
- Firebase CLI (for local development)

### Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/invertase/tanstack-query-firebase.git
cd tanstack-query-firebase
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the Firebase emulators (required for testing):
```bash
pnpm emulator
```

## Development Tools

### Turborepo

This project uses Turborepo for managing the monorepo. Key commands:

- `pnpm turbo build` - Build all packages
- `pnpm turbo test` - Run tests across all packages

The Turborepo configuration ensures proper dependency management and caching for all tasks.

> NOTE: For the `pnpm turbo test` command to work, please ensure to have the emulator running. The emulator can be started by running `pnpm emulator`.

### Biome

We use Biome for code formatting and linting. Available commands:

- `pnpm format` - Check formatting without making changes
- `pnpm format:fix` - Fix formatting issues

### Changesets

We use Changesets for versioning and publishing packages. Changesets should be created **during development**, not during release.

#### Creating Changesets

When making changes that should be released:

1. Make your changes
2. Run `pnpm changeset` to create a changeset:
   ```bash
   pnpm changeset
   ```
3. Follow the interactive prompts:
   - Select which packages have changed
   - Choose the version bump type (patch/minor/major)
   - Write a description of your changes
4. Commit the generated changeset file (`.changeset/*.md`)
5. Submit a pull request

#### Changeset Types

- **patch**: Bug fixes and patches (e.g., `1.0.0` → `1.0.1`)
- **minor**: New features (e.g., `1.0.0` → `1.1.0`)
- **major**: Breaking changes (e.g., `1.0.0` → `2.0.0`)

#### Example Changeset

The command generates a file like `.changeset/abc123-feature-description.md`:
```markdown
---
"@tanstack-query-firebase/react": minor
"@tanstack-query-firebase/angular": patch
---

Added new authentication feature to React package and fixed bug in Angular package.
```

## Testing

The project uses Vitest for testing. Each package has its own test suite and configuration:

- React package: `cd packages/react && pnpm test`
- Angular package: `cd packages/angular && pnpm test`

Tests are configured to run sequentially (no parallel execution) to prevent race conditions. The test configuration is managed in each package's `vitest.config.ts` file.

To run all tests through Turborepo:
```bash
pnpm test
```

To run tests with Firebase emulator (recommended for CI):
```bash
pnpm test:emulator
```

Note: The `test:emulator` command uses `firebase emulators:exec` which automatically starts the emulator, runs tests, and shuts down the emulator when complete.

## GitHub Workflows

The project has two main workflows:

1. **Tests** (`tests.yaml`):
   - Runs on push to main and pull requests
   - Checks formatting
   - Runs tests for changed packages
   - Uses Firebase emulators for testing
   - Respects package-specific test configurations

2. **Release** (`release.yml`):
   - Manual trigger with release type selection
   - Validates that changesets exist (created during development)
   - Runs tests and builds packages
   - Publishes packages to npm
   - Supports dry runs for validation

## Making Changes

1. Create a new branch for your changes
2. Make your changes
3. Add tests if applicable
4. Run formatting: `pnpm format`
5. Run tests: `pnpm test`
6. **Create a changeset**: `pnpm changeset` (if changes should be released)
7. Commit all changes including the changeset file
8. Submit a pull request

## Release Process

### For Contributors
1. Create changesets during development using `pnpm changeset`
2. Ensure changesets are committed and merged to main
3. Maintainers will handle the actual release

### For Maintainers
1. Ensure all changesets are merged to main
2. Go to GitHub Actions → "Release Packages"
3. Choose release type and whether to do a dry run
4. The workflow will:
   - Validate changesets exist
   - Run tests and builds
   - Create version bumps and publish to npm

**Important**: Changesets must be created during development, not during release. The release workflow will fail if no changesets are found.

## Code Style

- Use Biome for formatting and linting
- Follow the existing code style
- Write tests for new features
- Update documentation as needed

## Documentation

Documentation is managed in the `docs` directory and uses docs.page for hosting. When making changes:

1. Update relevant documentation
2. Test documentation changes locally
3. Ensure all links are working

## Questions?

If you have any questions about contributing, please open an issue or reach out to the maintainers. 