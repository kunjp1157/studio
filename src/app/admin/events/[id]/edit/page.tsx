
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { EventAdminForm } from '@/components/admin/EventAdminForm';
import type { SportEvent } from '@/lib/types';
import { getEventById } from '@/lib/data';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [event, setEvent] = useState<SportEvent | null | undefined>(undefined); // undefined: loading, null: not found

  useEffect(() => {
    if (eventId) {
      // Simulate fetching event data
      setTimeout(() => {
        const foundEvent = getEventById(eventId);
        setEvent(foundEvent || null);
      }, 300);
    }
  }, [eventId]);

  if (event === undefined) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="text-muted-foreground">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-8">
        <PageTitle title="Edit Event" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: Event Not Found</AlertTitle>
          <AlertDescription>The event you are trying to edit could not be found.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/admin/events')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title={`Edit: ${event.name}`} description="Modify the details for this sports event." />
      <EventAdminForm initialData={event} />
    </div>
  );
}
