
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { MembershipAdminForm } from '@/components/admin/MembershipAdminForm';
import type { MembershipPlan } from '@/lib/types';
import { getMembershipPlanById } from '@/lib/data';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditMembershipPlanPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;
  const [plan, setPlan] = useState<MembershipPlan | null | undefined>(undefined); // undefined: loading, null: not found

  useEffect(() => {
    if (planId) {
      setTimeout(() => { // Simulate fetch
        const foundPlan = getMembershipPlanById(planId);
        setPlan(foundPlan || null);
      }, 300);
    }
  }, [planId]);

  if (plan === undefined) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="text-muted-foreground">Loading membership plan details...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="space-y-8">
        <PageTitle title="Edit Membership Plan" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: Membership Plan Not Found</AlertTitle>
          <AlertDescription>The membership plan you are trying to edit could not be found.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/admin/memberships')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Membership Plans List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title={`Edit Membership Plan: ${plan.name}`} description="Modify the details for this membership tier." />
      <MembershipAdminForm initialData={plan} />
    </div>
  );
}
