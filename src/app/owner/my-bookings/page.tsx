
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Construction } from 'lucide-react';

export default function OwnerBookingsPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Your Facility Bookings" description="View and manage bookings made for your facilities." />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ticket className="mr-2 h-6 w-6 text-primary" />
            Bookings Overview
          </CardTitle>
          <CardDescription>
            This section will display bookings for your facilities. You'll be able to filter, view details, and manage reservations specific to your venues.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Booking Management Tools Under Development</h3>
          <p className="text-muted-foreground mt-2">
            The interface for managing bookings at your facilities is currently being built.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
