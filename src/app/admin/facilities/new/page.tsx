
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { FacilityAdminForm } from '@/components/admin/FacilityAdminForm';

export default function AddFacilityPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Add New Facility" description="Enter the details for the new sports facility to add it to the platform." />
      <FacilityAdminForm />
    </div>
  );
}
