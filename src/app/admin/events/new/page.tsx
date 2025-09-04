
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { EventAdminForm } from '@/components/admin/EventAdminForm';

export default function AddEventPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Add New Event" description="Enter the details for the new sports event to add it to the platform." />
      <EventAdminForm />
    </div>
  );
}

    