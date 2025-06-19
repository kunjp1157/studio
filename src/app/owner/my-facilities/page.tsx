
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Construction, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OwnerFacilitiesPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Manage Your Facilities" description="View, edit, and update details for your listed sports facilities." />

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="flex items-center">
                    <Building className="mr-2 h-6 w-6 text-primary" />
                    Your Facility Listings
                </CardTitle>
                <CardDescription>
                    Here you'll be able to add new facilities, edit existing ones, manage photos, amenities, and operating hours specific to your venues.
                </CardDescription>
            </div>
            <Button variant="outline" disabled>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Facility
            </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Facility Management Tools Under Development</h3>
          <p className="text-muted-foreground mt-2">
            The interface for managing your facility details is currently being built. Please check back later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
