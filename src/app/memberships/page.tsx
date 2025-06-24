
'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { MembershipPlan, SiteSettings } from '@/lib/types';
import { mockMembershipPlans } from '@/lib/data';
import { getSiteSettingsAction } from '@/app/actions';
import { Award, CheckCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function MembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  useEffect(() => {
    // Simulate fetching membership plans
    setTimeout(() => {
      setPlans(mockMembershipPlans);
      setIsLoading(false);
    }, 500);

    const fetchSettings = async () => {
      const settings = await getSiteSettingsAction();
      setCurrency(settings.defaultCurrency);
    }
    fetchSettings();
  }, []);

  const handleSelectPlan = (planName: string) => {
    toast({
        title: "Plan Selected (Mock)",
        description: `You've selected the ${planName} plan. Proceed to checkout to activate. (This is a mock action)`,
    });
    // In a real app, redirect to a checkout/payment page for the selected plan
  };

  const renderPrice = (price: number) => {
    if (!currency) return <Skeleton className="h-10 w-28 inline-block" />;
    return formatCurrency(price, currency);
  };
  
  const PlanSkeleton = () => (
    <Card className="animate-pulse flex flex-col">
        <CardHeader className="items-center text-center">
            <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-10 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent className="space-y-3 mt-4 flex-grow">
            {[1,2,3].map(i => <div key={i} className="h-5 bg-muted rounded w-full"></div>)}
            <div className="h-5 bg-muted rounded w-2/3"></div>
        </CardContent>
        <CardFooter>
            <div className="h-12 bg-muted rounded w-full"></div>
        </CardFooter>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <PageTitle title="Membership Plans" description="Unlock exclusive benefits and discounts with our membership tiers." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 items-stretch">
          <PlanSkeleton />
          <PlanSkeleton />
          <PlanSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Membership Plans" description="Unlock exclusive benefits and discounts with our membership tiers." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 items-stretch">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={cn(`flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl`,
                        plan.name === 'Premium' && 'border-primary border-2 scale-105 relative bg-background'
            )}
          >
            {plan.name === 'Premium' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center z-10">
                    <Star className="w-4 h-4 mr-1 fill-current" /> Most Popular
                </div>
            )}
            <CardHeader className="text-center pt-10">
              <Award className={cn('mx-auto h-12 w-12 mb-4', plan.name === 'Premium' ? 'text-primary' : 'text-muted-foreground')} />
              <CardTitle className="text-3xl font-headline">{plan.name}</CardTitle>
              <div className="text-4xl font-bold text-primary my-2 h-10 flex justify-center items-center">
                {renderPrice(plan.pricePerMonth)}
              </div>
              <p className="text-sm font-normal text-muted-foreground">/month</p>
              <CardDescription className="pt-2">{plan.name === 'Basic' ? 'Essential access' : plan.name === 'Premium' ? 'Best value & perks' : 'Ultimate experience'}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-sm">
              <ul className="space-y-3">
                {plan.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto p-6">
              <Button 
                className={cn('w-full text-lg py-6', plan.name === 'Premium' ? '' : 'bg-accent text-accent-foreground hover:bg-accent/90')}
                variant={plan.name === 'Premium' ? 'default' : 'secondary'}
                onClick={() => handleSelectPlan(plan.name)}
              >
                Choose {plan.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
