# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern full-stack starter template built with AdonisJS v6, Inertia.js, React 19, TypeScript, Tailwind CSS, and Shadcn UI. It provides a solid foundation for building web applications with authentication, database integration, and a beautiful UI out of the box.

## Monorepo Structure

This is a pnpm workspace with a single package:

- `packages/platform` - Main AdonisJS application containing both backend and frontend code

## Development Commands

All commands should be run from the root or `packages/platform/`:

```bash
# Development server with HMR
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start

# Run tests
pnpm test

# Linting and formatting
pnpm lint
pnpm format
pnpm typecheck

# Database migrations
node ace migration:run
node ace migration:rollback
node ace migration:fresh

# Generate new migration
node ace make:migration <name>
```

## Architecture

### Database Models

The application uses PostgreSQL with Lucid ORM. Currently has one core model:

- **User** (`app/models/user.ts`) - Standard user with email/password auth using AdonisJS Auth with Scrypt hashing
  - Fields: id, fullName (optional), email (unique), password (hashed), createdAt, updatedAt
  - Uses withAuthFinder mixin for authentication
  - Password is automatically hashed and never serialized in responses

**Note**: There is no Account model currently. The old CLAUDE.md referenced OAuth integration that doesn't exist in this starter.

### Frontend Stack

- **Inertia.js** with React 19 for monolithic SPA architecture
- **Vite** for asset bundling with HMR enabled
- **TypeScript** throughout both frontend and backend
- **Tailwind CSS v4** for styling
- **Shadcn UI** components (55+ components in `inertia/components/ui/`)
- Pages located in `packages/platform/inertia/pages/`
- Hot module replacement configured via `hot-hook` package

### Path Aliases

Backend path aliases (configured in package.json `imports`):

```typescript
#controllers/*  -> ./app/controllers/*.js
#models/*        -> ./app/models/*.js
#services/*      -> ./app/services/*.js
#dtos/*          -> ./app/dtos/*.js
#validators/*    -> ./app/validators/*.js
#middleware/*    -> ./app/middleware/*.js
#config/*        -> ./config/*.js
#start/*         -> ./start/*.js
#database/*      -> ./database/*.js
#mails/*         -> ./app/mails/*.js
#listeners/*     -> ./app/listeners/*.js
#events/*        -> ./app/events/*.js
#providers/*     -> ./providers/*.js
#policies/*      -> ./app/policies/*.js
#abilities/*     -> ./app/abilities/*.js
```

Frontend path alias (configured in `vite.config.ts`):
```typescript
~/  -> ./inertia/
```

### Authentication & Authorization

Session-based authentication using AdonisJS Auth:

**Middleware:**
- `auth` - Requires authentication, redirects to `/login` if not authenticated
- `guest` - Restricts authenticated users from accessing routes (e.g., login/register pages)
- `silentAuth` - Optional authentication check that loads user context without requiring login

**Validators** (`app/validators/auth/`):
- `registerValidator` - Validates registration (fullName optional, email unique, password min 8 chars)
- `loginValidator` - Validates login credentials

**Routes** (`start/routes.ts`):
- Public: `GET /` (home page with silentAuth)
- Guest only: `GET/POST /register`, `GET/POST /login`
- Protected: `POST /logout`, `GET /profile`

**Session Configuration** (`config/session.ts`):
- Cookie-based with 2-hour age
- httpOnly: true, sameSite: 'lax'
- Persists across browser restarts

### Inertia.js Integration

**Shared Props** (`config/inertia.ts`):
All pages automatically receive:
- `user` - Current authenticated user (if logged in)
- `flash` - Flash messages (success/error) from session

**Page Component Pattern:**
```typescript
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@adonisjs/inertia/types';

interface HomeProps extends PageProps {
  // Add page-specific props here
}

export default function Home() {
  const { user, flash } = usePage<HomeProps>().props;
  // Component logic
}
```

**Form Handling:**
```typescript
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors } = useForm({
  email: '',
  password: '',
});

function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  post('/login');
}
```

### Testing

Test suites configured in `adonisrc.ts`:
- **Unit tests**: `tests/unit/**/*.spec.ts` (2s timeout)
- **Functional tests**: `tests/functional/**/*.spec.ts` (30s timeout)

Uses Japa test runner with @japa/plugin-adonisjs for framework integration.

## Configuration Files

Key configuration files in `packages/platform/config/`:
- `app.ts` - Core AdonisJS app config (APP_KEY, cookies, async local storage)
- `auth.ts` - Authentication guard and session configuration
- `database.ts` - PostgreSQL connection (debug mode enabled in development)
- `inertia.ts` - Inertia.js setup with SSR, shared props
- `session.ts` - Session storage and cookie settings
- `shield.ts` - CSRF protection and security headers
- `cors.ts` - CORS configuration
- `bodyparser.ts` - Request body parsing limits and formats
- `static.ts` - Static file serving configuration
- `vite.ts` - Vite asset bundling configuration
- `ally.ts` - OAuth provider configuration (currently empty)

## Common Patterns

### Adding a New Page

1. Create React component in `inertia/pages/`
2. Add controller method in `app/controllers/`
3. Render with Inertia: `return inertia.render('page-name', { props })`
4. Register route in `start/routes.ts`

Example controller:
```typescript
async show({ inertia }: HttpContext) {
  return inertia.render('my-page', {
    data: 'some data',
  })
}
```

### Adding Validation

1. Create validator in `app/validators/` using VineJS
2. Use in controller with `request.validateUsing(validator)`

Example validator:
```typescript
import vine from '@vinejs/vine'

export const myValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    name: vine.string().minLength(2),
  })
)
```

### Adding a Model

1. Generate migration: `node ace make:migration create_<table>_table`
2. Create model in `app/models/` extending BaseModel
3. Define columns with `@column()` decorators
4. Run migration: `node ace migration:run`

### Adding Middleware

1. Create middleware in `app/middleware/`
2. Register in `start/kernel.ts`
3. Apply to routes in `start/routes.ts`

### Working with DTOs

DTOs prevent sensitive data from leaking to the frontend:

```typescript
// app/dtos/user_dto.ts
export class UserDto {
  constructor(
    public id: number,
    public email: string,
    public fullName: string | null
  ) {}

  static fromModel(user: User) {
    return new UserDto(user.id, user.email, user.fullName)
  }
}
```

Use in controllers:
```typescript
const userDto = UserDto.fromModel(user)
return inertia.render('profile', { user: userDto })
```

## Security Considerations

1. **APP_KEY Protection**:
   - Never commit `.env` to git
   - APP_KEY is used for encryption and cookie signing
   - Loss of APP_KEY means encrypted data becomes unrecoverable

2. **Password Security**:
   - Uses Scrypt hashing with high security parameters (cost: 16384, blockSize: 8)
   - Passwords never serialized in User model responses

3. **CSRF Protection**:
   - Enabled by default via Shield middleware
   - Protects POST, PUT, PATCH, DELETE methods
   - XSRF cookie available for frontend requests

4. **Session Security**:
   - httpOnly cookies prevent XSS attacks
   - sameSite: 'lax' prevents CSRF
   - 2-hour session timeout

## Vite & Asset Pipeline

**Development:**
- Vite dev server runs alongside AdonisJS
- HMR enabled for instant feedback
- Entry point: `inertia/app/app.tsx`

**Production:**
- Build outputs to `public/assets/`
- Manifest-based asset versioning for cache busting
- SSR bundle generated for server-side rendering

**SSR Configuration:**
- Client entry: `inertia/app/app.tsx`
- SSR entry: `inertia/app/ssr.tsx`
- Enabled in `config/inertia.ts`

## Environment Variables

Required variables (see `.env.example`):
- `NODE_ENV` - development or production
- `PORT` - Server port (default: 3333)
- `APP_KEY` - Encryption key (generate with `node ace generate:key`)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` - PostgreSQL connection
- `SESSION_DRIVER` - Session storage (cookie or memory)
- `LOG_LEVEL` - Logging verbosity (debug, info, warn, error)

## Key Architectural Decisions

1. **Monolithic Architecture**: Inertia.js allows building SPAs without API complexity
2. **Session-based Auth**: Simpler than JWT for server-rendered applications
3. **Type Safety**: Full TypeScript coverage from database to UI
4. **Component Library**: Shadcn UI provides customizable, accessible components
5. **No Services Directory**: Currently empty - add business logic services as needed
6. **DTO Pattern**: Prevents accidental data exposure to frontend
7. **Path Aliases**: Clean imports without relative path hell
8. **Validation at Boundary**: VineJS validators run at controller level
