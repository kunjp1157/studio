'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { MembershipPlan } from '@/lib/types';
import { mockMembershipPlans } from '@/lib/data';
import { Award, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

export default function MembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching membership plans
    setTimeout(() => {
      setPlans(mockMembershipPlans);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSelectPlan = (planName: string) => {
    toast({
        title: "Plan Selected (Mock)",
        description: `You've selected the ${planName} plan. Proceed to checkout to activate. (This is a mock action)`,
    });
    // In a real app, redirect to a checkout/payment page for the selected plan
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <PageTitle title="Membership Plans" description="Unlock exclusive benefits and discounts with our membership tiers." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {Array.from({ length: 3 }).map((_, index) => (
             <Card key={index} className="animate-pulse">
                <CardHeader>
                    <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-10 bg-muted rounded w-1/4"></div>
                </CardHeader>
                <CardContent className="space-y-3 mt-4">
                    {[1,2,3].map(i => <div key={i} className="h-4 bg-muted rounded w-full"></div>)}
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
                <CardFooter>
                    <div className="h-12 bg-muted rounded w-full"></div>
                </CardFooter>
             </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Membership Plans" description="Unlock exclusive benefits and discounts with our membership tiers." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {plans.map((plan, index) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl
                        ${plan.name === 'Premium' ? 'border-primary border-2 scale-105 relative' : ''}`}
          >
            {plan.name === 'Premium' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current" /> Most Popular
                </div>
            )}
            <CardHeader className="text-center pt-10">
              <Award className={`mx-auto h-12 w-12 mb-4 ${plan.name === 'Premium' ? 'text-primary' : 'text-muted-foreground'}`} />
              <CardTitle className="text-3xl font-headline">{plan.name}</CardTitle>
              <p className="text-4xl font-bold text-primary my-2">
                ${plan.pricePerMonth}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <CardDescription>{plan.name === 'Basic' ? 'Essential access' : plan.name === 'Premium' ? 'Best value & perks' : 'Ultimate experience'}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-sm">
              <ul className="space-y-2">
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
                className={`w-full text-lg py-6 ${plan.name === 'Premium' ? '' : 'bg-accent text-accent-foreground hover:bg-accent/90'}`}
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
