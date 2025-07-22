
'use client';

import { FacilityAdminForm } from '@/components/admin/FacilityAdminForm';
import { PageTitle } from '@/components/shared/PageTitle';
import { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function AddOwnerFacilityPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
        setCurrentUser(JSON.parse(activeUser));
    }
  }, []);

  if (!currentUser) {
    // Optionally show a loading state or a message
    return <p>Loading user...</p>;
  }

  return (
    <div className="space-y-8">
      <PageTitle title="Add New Facility" description="Enter the details for your new sports facility." />
      <FacilityAdminForm
        ownerId={currentUser.id}
        onSubmitSuccess={() => {
          router.push('/owner/my-facilities');
        }}
      />
    </div>
  );
}
