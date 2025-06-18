'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Construction } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="User Management" description="Oversee and manage user accounts on the platform." />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-6 w-6 text-primary" />
            Registered Users
          </CardTitle>
          <CardDescription>
            This section will allow administrators to view, edit, and manage user profiles, roles, and statuses.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Development</h3>
          <p className="text-muted-foreground mt-2">
            User management functionalities are currently being built. Please check back later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
