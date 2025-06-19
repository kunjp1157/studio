
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Construction } from 'lucide-react'; // Renamed EventIcon to CalendarDays for consistency

export default function AdminEventsPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Event Management" description="Create, manage, and promote sports events and tournaments." />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="mr-2 h-6 w-6 text-primary" />
            Sports Events
          </CardTitle>
          <CardDescription>
            This section will enable administrators to set up and manage sports events, tournaments, leagues, including scheduling, registration, and participant management.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Development</h3>
          <p className="text-muted-foreground mt-2">
            Event management tools are currently under construction. Please check back later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
