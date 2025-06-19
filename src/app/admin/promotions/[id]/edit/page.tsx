
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { PromotionRuleAdminForm } from '@/components/admin/PromotionRuleAdminForm';
import type { PromotionRule } from '@/lib/types';
import { getPromotionRuleById } from '@/lib/data';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditPromotionRulePage() {
  const params = useParams();
  const router = useRouter();
  const ruleId = params.id as string;
  const [rule, setRule] = useState<PromotionRule | null | undefined>(undefined);

  useEffect(() => {
    if (ruleId) {
      setTimeout(() => { 
        const foundRule = getPromotionRuleById(ruleId);
        setRule(foundRule || null);
      }, 300);
    }
  }, [ruleId]);

  if (rule === undefined) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="text-muted-foreground">Loading promotion rule details...</p>
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="space-y-8">
        <PageTitle title="Edit Promotion Rule" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: Promotion Rule Not Found</AlertTitle>
          <AlertDescription>The promotion rule you are trying to edit could not be found.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/admin/promotions')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Promotions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title={`Edit Promotion: ${rule.name}`} description="Modify the details for this promotion or coupon." />
      <PromotionRuleAdminForm initialData={rule} />
    </div>
  );
}
