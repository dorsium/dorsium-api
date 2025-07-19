<!-- Modified by Contributor for: add missing contribution guide referenced in README -->
# Contributing to dorsium-api

This guide provides the workflow and code style conventions for contributing to the Dorsium API.

## Setup

1. Clone the repository and install dependencies.
   ```bash
   git clone https://github.com/dorsium/dorsium-api.git
   cd dorsium-api
   npm install
   ```
2. Copy the environment template and update values as needed.
   ```bash
   cp .env.example .env
   ```
3. Start the development server with Hot Reloading.
   ```bash
   npm run dev
   ```

## Code Style

- Follow the project folder structure outlined in the README.
- Use named ES module imports.
- Validate all input with Zod schemas.
- Keep route files minimal and delegate logic to `services/`.

## Pull Requests

- Ensure all tests pass before opening a PR.
  ```bash
  npm test
  ```
- Write clear, concise commit messages in English.
- Include a brief PR description summarizing changes.
- Reference related issues when applicable.

## Signing Off

Thank you for contributing to Dorsium! Please reach out via GitHub issues if you have any questions.

