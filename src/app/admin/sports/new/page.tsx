
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { SportAdminForm } from '@/components/admin/SportAdminForm';

export default function AddSportPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Add New Sport" description="Define a new sport available for facilities to offer." />
      <SportAdminForm />
    </div>
  );
}
