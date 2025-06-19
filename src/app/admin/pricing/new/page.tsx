
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { PricingRuleAdminForm } from '@/components/admin/PricingRuleAdminForm';

export default function AddPricingRulePage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Add New Pricing Rule" description="Define a new rule to dynamically adjust facility prices." />
      <PricingRuleAdminForm />
    </div>
  );
}
