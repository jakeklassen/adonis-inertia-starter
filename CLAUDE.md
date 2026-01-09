# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack starter template: AdonisJS v6 + Inertia.js + React 19 + TypeScript + Tailwind CSS v4 + Shadcn UI.

## Monorepo Structure

pnpm workspace with single package at `packages/platform/` containing both backend and frontend code.

## Development Commands

All commands must be run from `packages/platform/` (root package.json has no scripts):

```bash
# Development server with HMR
pnpm dev

# Build and run production
pnpm build
pnpm start

# Run all tests
pnpm test

# Run specific test file
node ace test tests/functional/auth.spec.ts

# Run test suite
node ace test --tests=unit
node ace test --tests=functional

# Linting and formatting
pnpm lint
pnpm format
pnpm typecheck

# Database migrations
node ace migration:run
node ace migration:rollback
node ace migration:fresh
node ace make:migration <name>

# Scheduled tasks (run in console environment)
node ace scheduler:run
```

## Architecture

### Path Aliases

Backend (configured in `package.json` imports):
```
#controllers/*  -> ./app/controllers/*.js
#models/*       -> ./app/models/*.js
#services/*     -> ./app/services/*.js
#dtos/*         -> ./app/dtos/*.js
#validators/*   -> ./app/validators/*.js
#middleware/*   -> ./app/middleware/*.js
#exceptions/*   -> ./app/exceptions/*.js
#config/*       -> ./config/*.js
#start/*        -> ./start/*.js
#database/*     -> ./database/*.js
#tests/*        -> ./tests/*.js
```

Frontend (configured in `vite.config.ts`):
```
~/  -> ./inertia/
```

### Authentication

Session-based auth with AdonisJS Auth. Key middleware:
- `auth` - Requires authentication, redirects to `/login`
- `guest` - Blocks authenticated users (login/register pages)
- `silentAuth` - Optional auth check, loads user without requiring login

Routes defined in `start/routes.ts`. Validators in `app/validators/auth/`.

### Inertia.js Integration

Shared props (available to all pages via `config/inertia.ts`):
- `user` - Current authenticated user (if logged in)
- `flash` - Flash messages from session

Page component pattern:
```typescript
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@adonisjs/inertia/types';

export default function MyPage() {
  const { user, flash } = usePage<PageProps>().props;
}
```

Form handling:
```typescript
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors } = useForm({
  email: '',
  password: '',
});
```

### Testing

Uses Japa test runner. Suites configured in `adonisrc.ts`:
- **Unit tests**: `tests/unit/**/*.spec.ts` (2s timeout)
- **Functional tests**: `tests/functional/**/*.spec.ts` (30s timeout)

### Scheduler

Uses `adonisjs-scheduler`. Define scheduled tasks in `start/scheduler.ts`. Runs only in console environment.

## Common Patterns

### Adding a New Page

1. Create React component in `inertia/pages/`
2. Add controller method in `app/controllers/`
3. Render: `return inertia.render('page-name', { props })`
4. Register route in `start/routes.ts`

### Adding Validation

```typescript
import vine from '@vinejs/vine'

export const myValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    name: vine.string().minLength(2),
  })
)

// In controller:
const payload = await request.validateUsing(myValidator)
```

### Adding a Model

1. `node ace make:migration create_<table>_table`
2. Create model in `app/models/` extending BaseModel
3. Define columns with `@column()` decorators
4. `node ace migration:run`

### DTOs

Prevent sensitive data leaking to frontend:
```typescript
export class UserDto {
  static fromModel(user: User) {
    return { id: user.id, email: user.email, fullName: user.fullName }
  }
}
```

## Key Files

- `start/routes.ts` - Route definitions
- `start/kernel.ts` - Middleware registration
- `start/scheduler.ts` - Scheduled task definitions
- `config/inertia.ts` - Inertia shared props
- `config/auth.ts` - Auth guard configuration
- `adonisrc.ts` - AdonisJS app configuration
