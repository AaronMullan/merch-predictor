'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-muted-foreground flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-3xl space-y-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Page Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center p-4">
                <span className="text-8xl">👕</span>
              </div>
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground">
                  Oops! Looks like this design hasn't been printed yet.
                </p>
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
