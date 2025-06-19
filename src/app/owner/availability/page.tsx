
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Construction } from 'lucide-react';

export default function OwnerAvailabilityPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Manage Facility Availability" description="Control and update the available slots for your facilities." />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarClock className="mr-2 h-6 w-6 text-primary" />
            Slot Management
          </CardTitle>
          <CardDescription>
            Here you will be able to block/unblock time slots, set special hours, and manage real-time availability for each of your facilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Availability Tools Under Development</h3>
          <p className="text-muted-foreground mt-2">
            Tools for managing your facility's schedule and availability are coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
