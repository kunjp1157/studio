
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { MembershipAdminForm } from '@/components/admin/MembershipAdminForm';

export default function AddMembershipPlanPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Add New Membership Plan" description="Define a new membership tier with its benefits and pricing." />
      <MembershipAdminForm />
    </div>
  );
}

    