
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Construction, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminPricingPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Dynamic Pricing Management" description="Configure and manage pricing rules for facilities." />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-6 w-6 text-primary" />
            Pricing Rules Engine
          </CardTitle>
          <CardDescription>
            This section will allow administrators to create, edit, and manage dynamic pricing rules based on factors like peak hours, day of the week, demand, or special events.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Development</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            The tools for managing dynamic pricing rules are currently being built. Please check back later.
          </p>
          <Alert variant="default" className="text-left max-w-md mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Conceptual Overview</AlertTitle>
            <AlertDescription>
              Dynamic pricing will allow you to:
              <ul className="list-disc list-inside mt-2 pl-4 text-sm">
                <li>Set higher prices for weekend evenings.</li>
                <li>Offer discounts for off-peak weekday mornings.</li>
                <li>Adjust prices based on demand or special events.</li>
                <li>Define rules with priorities to handle overlaps.</li>
              </ul>
              <p className="mt-2 text-xs">The actual booking price will be calculated by applying these rules to the facility's base price.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
