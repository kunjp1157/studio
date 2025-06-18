'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Construction } from 'lucide-react';

export default function AdminMembershipsPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Membership Management" description="Configure and manage membership plans and subscribers." />

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-6 w-6 text-primary" />
            Membership Plans
          </CardTitle>
          <CardDescription>
            This section will allow administrators to create, edit, and manage different membership tiers, benefits, and pricing.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Development</h3>
          <p className="text-muted-foreground mt-2">
            Membership management tools are currently being developed. Please check back soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
