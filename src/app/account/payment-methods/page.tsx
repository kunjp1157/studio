'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Construction, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentMethodsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Payment Methods" description="Manage your saved payment options for quick and easy bookings." />

      <Card className="shadow-lg mt-8">
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-6 w-6 text-primary" />
                    Saved Cards
                </CardTitle>
                <CardDescription>
                    Your securely stored payment methods.
                </CardDescription>
            </div>
            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add New Card</Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[200px] text-center">
          <Construction className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Coming Soon</h3>
          <p className="text-muted-foreground mt-1">
            Functionality to add and manage payment methods will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
