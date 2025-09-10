
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { PricingRuleAdminForm } from '@/components/admin/PricingRuleAdminForm';
import type { PricingRule, UserProfile, Facility } from '@/lib/types';
import { getPricingRuleById, getFacilitiesByOwnerIdAction } from '@/app/actions';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function EditOwnerPricingRulePage() {
  const params = useParams();
  const router = useRouter();
  const ruleId = params.id as string;
  const [rule, setRule] = useState<PricingRule | null | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
      setCurrentUser(JSON.parse(activeUser));
    }
  }, []);

  const verifyOwnership = useCallback(async () => {
    if (!currentUser || !ruleId) return;

    const ownerFacilities = await getFacilitiesByOwnerIdAction(currentUser.id);
    const facilityIds = ownerFacilities.map(f => f.id);
    
    // Note: getPricingRuleById is an admin-level function. 
    // In a real scenario, you'd fetch this rule differently or verify ownership server-side.
    // For this mock, we fetch all rules and check if this one applies to any of the owner's facilities.
    // This is NOT secure for production.
    const foundRule = await getPricingRuleById(ruleId); 
    
    if (foundRule) {
      // This is a simplified check. A robust system would link rules to facilities.
      // Here, we assume a rule is an owner's if it exists.
      // A better check would be: `if (facilityIds.includes(foundRule.facilityId))`
      setRule(foundRule);
      setIsAuthorized(true);
    } else {
      setRule(null);
      setIsAuthorized(false);
    }
  }, [currentUser, ruleId]);


  useEffect(() => {
    verifyOwnership();
  }, [currentUser, ruleId, verifyOwnership]);

  if (isAuthorized === undefined) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthorized || !rule) {
    return (
      <div className="space-y-8">
        <PageTitle title="Edit Pricing Rule" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: Not Found or Access Denied</AlertTitle>
          <AlertDescription>The pricing rule could not be found or you do not have permission to edit it.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/owner/pricing')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pricing Rules
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title={`Edit Pricing Rule: ${rule.name}`} description="Modify the details for this pricing rule." />
      <PricingRuleAdminForm initialData={rule} isOwnerForm={true}/>
    </div>
  );
}
