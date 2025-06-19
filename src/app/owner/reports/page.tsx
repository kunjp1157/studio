
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, Construction } from 'lucide-react';

export default function OwnerReportsPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Your Facility Reports" description="Gain insights into your facility's performance and booking trends." />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2 h-6 w-6 text-primary" />
            Performance Analytics
          </CardTitle>
          <CardDescription>
            This section will provide reports on bookings, revenue, peak hours, and other relevant data specific to your facilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Reporting Tools Under Development</h3>
          <p className="text-muted-foreground mt-2">
            Analytics and reporting features for your facilities are currently being built.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
