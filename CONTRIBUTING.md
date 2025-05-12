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
- `pnpm turbo dev` - Start development servers

The Turborepo configuration ensures proper dependency management and caching for all tasks.

### Biome

We use Biome for code formatting and linting. Available commands:

- `pnpm format` - Format all files
- `pnpm format:ci` - Check formatting without making changes
- `pnpm format:fix` - Fix formatting issues

### Changesets

We use Changesets for versioning and publishing packages. To create a new changeset:

1. Make your changes
2. Run `pnpm changeset`
3. Follow the prompts to describe your changes
4. Commit the generated changeset file

## Testing

The project uses Vitest for testing. Each package has its own test suite and configuration:

- React package: `cd packages/react && pnpm test`
- Angular package: `cd packages/angular && pnpm test`

Tests are configured to run sequentially (no parallel execution) to prevent race conditions. The test configuration is managed in each package's `vitest.config.ts` file.

To run all tests through Turborepo:
```bash
pnpm test
```

Note: Make sure the Firebase emulator is running before executing tests.

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
   - Creates or updates changesets
   - Publishes packages to npm
   - Supports dry runs

## Making Changes

1. Create a new branch for your changes
2. Make your changes
3. Add tests if applicable
4. Run formatting: `pnpm format`
5. Run tests: `pnpm test`
6. Create a changeset if needed: `pnpm changeset`
7. Submit a pull request

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