
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { PromotionRuleAdminForm } from '@/components/admin/PromotionRuleAdminForm';

export default function AddPromotionRulePage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Add New Promotion Rule" description="Define a new promotion or discount code for users." />
      <PromotionRuleAdminForm />
    </div>
  );
}
