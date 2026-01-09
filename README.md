# AdonisJS Inertia Starter

A modern, type-safe full-stack starter template for building web applications.

## Tech Stack

- **AdonisJS v6** - Type-safe backend framework
- **Inertia.js** - Modern monolith architecture
- **React 19** - UI library with TypeScript
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Pre-built accessible components
- **PostgreSQL** - Database with Lucid ORM
- **Vite** - Fast build tooling with HMR

## Features

- Authentication system (login/register) with session management
- PostgreSQL database with migrations
- Type-safe path aliases throughout
- Pre-configured UI components with dark mode support
- Development tools (linting, formatting, type checking)

## Getting Started

```bash
# Install dependencies
pnpm install

# Navigate to the platform package
cd packages/platform

# Copy environment file and generate app key
cp .env.example .env
node ace generate:key
# Copy the output and set APP_KEY in .env

# Setup database
node ace migration:run

# Start development server
pnpm dev
```

## Running Tests

```bash
cd packages/platform
pnpm test
```
