import ProfilesController from '#controllers/profiles_controller';
import { InferPageProps } from '@adonisjs/inertia/types';
import { Head, Link, router } from '@inertiajs/react';
import { Code2 } from 'lucide-react';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export default function Profile(props: InferPageProps<ProfilesController, 'show'>) {
  const { user, flash } = props;

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <>
      <Head title="Profile" />

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 max-w-screen-xl items-center px-4">
            <div className="mr-auto flex items-center gap-2">
              <Code2 className="h-6 w-6" />
              <Link href="/" className="text-xl font-bold">
                AdonisJS Starter
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto max-w-screen-xl px-4 py-8">
          {/* Flash Messages */}
          {flash?.success && (
            <Alert className="mb-6 border-success/50 bg-success/10">
              <AlertDescription>{flash.success}</AlertDescription>
            </Alert>
          )}
          {flash?.error && (
            <Alert className="mb-6 bg-destructive/10 border-destructive/20">
              <AlertDescription className="text-destructive">{flash.error}</AlertDescription>
            </Alert>
          )}

          {/* Profile Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-lg mt-1">{user.fullName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg mt-1">{user.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
