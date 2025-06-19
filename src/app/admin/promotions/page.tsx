
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, Construction, TicketSlash, Percent } from 'lucide-react'; // Added TicketSlash and Percent for more variety
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function AdminPromotionsPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Promotion & Discount Management" description="Create, manage, and track promotional offers, discount codes, and loyalty programs." />

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Tag className="mr-2 h-6 w-6 text-primary" />
              Promotional Rules & Coupons
            </CardTitle>
            <CardDescription>
              Define and oversee discount codes, special offers, and loyalty rewards to engage users and boost bookings.
            </CardDescription>
          </div>
          <Button variant="outline" disabled>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Promotion
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Development</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            The interface for creating and managing promotions (e.g., percentage discounts <Percent className="inline h-4 w-4" />, fixed amount off <TicketSlash className="inline h-4 w-4" />, coupon codes, usage limits, and validity periods) is currently being built.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Once implemented, you'll be able to apply these promotions during the booking process.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
