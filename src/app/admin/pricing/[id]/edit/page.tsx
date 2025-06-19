
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { PricingRuleAdminForm } from '@/components/admin/PricingRuleAdminForm';
import type { PricingRule } from '@/lib/types';
import { getPricingRuleById } from '@/lib/data';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditPricingRulePage() {
  const params = useParams();
  const router = useRouter();
  const ruleId = params.id as string;
  const [rule, setRule] = useState<PricingRule | null | undefined>(undefined);

  useEffect(() => {
    if (ruleId) {
      setTimeout(() => { 
        const foundRule = getPricingRuleById(ruleId);
        setRule(foundRule || null);
      }, 300);
    }
  }, [ruleId]);

  if (rule === undefined) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="text-muted-foreground">Loading pricing rule details...</p>
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="space-y-8">
        <PageTitle title="Edit Pricing Rule" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: Pricing Rule Not Found</AlertTitle>
          <AlertDescription>The pricing rule you are trying to edit could not be found.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/admin/pricing')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pricing Rules
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title={`Edit Pricing Rule: ${rule.name}`} description="Modify the details for this pricing rule." />
      <PricingRuleAdminForm initialData={rule} />
    </div>
  );
}
