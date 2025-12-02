import User from '#models/user';
import type { PageProps } from '@adonisjs/inertia/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Code2, Database, Layers, Palette, Rocket, Zap } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface HomeProps extends PageProps {
  user?: User;
}

export default function Home() {
  const { user } = usePage<HomeProps>().props;

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <>
      <Head title="AdonisJS Inertia Starter" />

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 max-w-screen-xl items-center px-4">
            <div className="mr-auto flex items-center gap-2">
              <Code2 className="h-6 w-6" />
              <span className="text-xl font-bold">AdonisJS Starter</span>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {user.fullName || user.email}
                  </span>
                  <Button variant="outline" onClick={handleLogout}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto max-w-screen-xl px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              AdonisJS + Inertia +{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                React Starter
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A modern, type-safe full-stack starter template with authentication, beautiful UI
              components, and developer experience built in. Start building your next project in
              minutes, not hours.
            </p>
            {user ? (
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button size="lg" variant="outline" asChild>
                  <a
                    href="https://github.com/your-repo/adonis-inertia-starter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </a>
                </Button>
              </div>
            ) : (
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a
                    href="https://github.com/your-repo/adonis-inertia-starter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Tech Stack Grid */}
        <div className="border-t bg-muted/50">
          <div className="container mx-auto max-w-screen-xl px-4 py-24">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
              Built with Modern Tools
            </h2>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <CardTitle>AdonisJS v6</CardTitle>
                  <CardDescription>
                    Type-safe backend framework with built-in authentication, ORM, validation, and
                    more. Convention over configuration done right.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Layers className="h-6 w-6" />
                  </div>
                  <CardTitle>Inertia.js + React 19</CardTitle>
                  <CardDescription>
                    Build modern SPAs without the complexity. Server-side routing with client-side
                    rendering using React 19 and TypeScript.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Palette className="h-6 w-6" />
                  </div>
                  <CardTitle>Tailwind + Shadcn UI</CardTitle>
                  <CardDescription>
                    Beautiful, accessible components built with Radix UI and styled with Tailwind
                    CSS. Customizable and production-ready.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Database className="h-6 w-6" />
                  </div>
                  <CardTitle>PostgreSQL + Lucid ORM</CardTitle>
                  <CardDescription>
                    Powerful database support with type-safe queries, migrations, and relationships.
                    Built-in encryption for sensitive data.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle>Vite + Hot Reload</CardTitle>
                  <CardDescription>
                    Lightning-fast development with Vite bundling and hot module replacement.
                    Instant feedback as you code.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Code2 className="h-6 w-6" />
                  </div>
                  <CardTitle>TypeScript Everywhere</CardTitle>
                  <CardDescription>
                    Full type safety from database to UI. Path aliases, strict types, and excellent
                    IDE support for confident refactoring.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto max-w-screen-xl px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              What's Included
            </h2>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  ✓
                </div>
                <h3 className="text-xl font-semibold">Authentication</h3>
                <p className="mt-2 text-muted-foreground">
                  Complete auth system with login, registration, and session management using
                  AdonisJS Auth.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  ✓
                </div>
                <h3 className="text-xl font-semibold">UI Components</h3>
                <p className="mt-2 text-muted-foreground">
                  Pre-configured Shadcn UI components with dark mode support and beautiful defaults.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  ✓
                </div>
                <h3 className="text-xl font-semibold">Developer Tools</h3>
                <p className="mt-2 text-muted-foreground">
                  Linting, formatting, type checking, and database debugging tools configured and
                  ready to use.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t">
          <div className="container mx-auto max-w-screen-xl px-4 py-8 text-center text-sm text-muted-foreground">
            <p>Built with AdonisJS, Inertia.js, React, TypeScript, Tailwind CSS, and Shadcn UI</p>
          </div>
        </footer>
      </div>
    </>
  );
}
