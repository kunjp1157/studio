
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { FacilityAdminForm } from '@/components/admin/FacilityAdminForm';
import { mockUser } from '@/lib/data'; // To get the current owner's ID

export default function AddOwnerFacilityPage() {
  // This page assumes mockUser is the currently logged-in owner.
  // The FacilityAdminForm itself doesn't inherently know the ownerId.
  // The submission logic in FacilityAdminForm or a wrapper here would need to inject it.
  // For simplicity, we'll let FacilityAdminForm handle it if we modify its onSubmit
  // or we pass a prop. For now, FacilityAdminForm does not handle ownerId injection.
  // We'll need to adjust how ownerId is set when creating a new facility.

  // The FacilityAdminForm can take an onFormSubmit prop that can inject ownerId
  // or the `addMockFacility` function can be adapted if context is available.
  // We'll ensure `addMockFacility` in `src/lib/data.ts` is modified to accept `ownerId`.
  // And the FacilityAdminForm's onSubmit will be used as is, with the calling page
  // responsible for enriching data if needed.

  // This component itself will not pass ownerId. It will be handled in FacilityAdminForm's
  // onSubmit logic when a new facility is created (if `initialData` is null).
  // For this specific "owner adds new facility" flow, the form submission
  // handler on *this page* (or within a modified FacilityAdminForm if we choose that route)
  // would ensure `ownerId: mockUser.id` is part of the data sent to `addMockFacility`.

  return (
    <div className="space-y-8">
      <PageTitle title="Add New Facility" description="Enter the details for your new sports facility." />
      {/* 
        We need a way for FacilityAdminForm to know the ownerId when creating.
        One option: Pass ownerId as a prop to FacilityAdminForm.
        Another: Modify addMockFacility to take it as a param.
        Let's assume addMockFacility will be updated, and FacilityAdminForm's internal 
        submit logic will pass mockUser.id if it's a new facility being created by an owner.
        However, FacilityAdminForm is generic. Better to handle it here.
      */}
      <FacilityAdminForm
        onSubmitSuccess={() => {
          // Potentially refresh or navigate after successful submission specifically from owner portal
        }}
      />
    </div>
  );
}
