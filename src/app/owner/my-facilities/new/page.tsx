
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { FacilityAdminForm } from '@/components/admin/FacilityAdminForm';
import { mockUser } from '@/lib/data'; // To get the current owner's ID
import { useRouter } from 'next/navigation';

export default function AddOwnerFacilityPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <PageTitle title="Add New Facility" description="Enter the details for your new sports facility." />
      <FacilityAdminForm
        ownerId={mockUser.id}
        onSubmitSuccess={() => {
          router.push('/owner/my-facilities');
        }}
      />
    </div>
  );
}
