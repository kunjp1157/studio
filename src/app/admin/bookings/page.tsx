'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Construction } from 'lucide-react';

export default function AdminBookingsPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="All Bookings" description="View and manage all bookings made on the platform." />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ticket className="mr-2 h-6 w-6 text-primary" />
            Booking Overview
          </CardTitle>
          <CardDescription>
            This section will display a comprehensive list of all bookings, allowing administrators to filter, view details, modify statuses, and manage reservations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Development</h3>
          <p className="text-muted-foreground mt-2">
            The comprehensive booking management interface is currently being built. Please check back later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
