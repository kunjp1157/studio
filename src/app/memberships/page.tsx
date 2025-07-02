
'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { MembershipPlan, SiteSettings, UserProfile } from '@/lib/types';
import { mockMembershipPlans, mockUser, updateUser } from '@/lib/data';
import { getSiteSettingsAction } from '@/app/actions';
import { Award, CheckCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function MembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null); // To track which plan is being updated
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUser); // Hold user state
  const { toast } = useToast();
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  useEffect(() => {
    // Simulate fetching membership plans
    setTimeout(() => {
      // Sort plans by price to ensure consistent order
      const sortedPlans = [...mockMembershipPlans].sort((a,b) => a.pricePerMonth - b.pricePerMonth);
      setPlans(sortedPlans);
      setIsLoading(false);
    }, 500);

    const fetchSettings = async () => {
      const settings = await getSiteSettingsAction();
      setCurrency(settings.defaultCurrency);
    }
    fetchSettings();
  }, []);

  // This effect will react to changes in the mockUser data if it were truly reactive.
  // For this mock setup, we will manually update our component state.
  useEffect(() => {
    setCurrentUser(mockUser);
  }, [mockUser.membershipLevel]);


  const handleSelectPlan = async (plan: MembershipPlan) => {
    setIsUpdating(plan.id);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call

    updateUser(currentUser.id, { membershipLevel: plan.name as 'Basic' | 'Premium' | 'Pro' });
    setCurrentUser(prev => ({...prev, membershipLevel: plan.name as 'Basic' | 'Premium' | 'Pro' }));
    
    toast({
        title: "Membership Updated!",
        description: `You are now on the ${plan.name} plan.`,
        className: 'bg-green-500 text-white'
    });
    setIsUpdating(null);
  };
  
  const getButtonState = (plan: MembershipPlan): { 
      text: string; 
      disabled: boolean; 
      variant: "default" | "secondary" | "outline";
      priceDiffText?: string;
    } => {
    if (isUpdating === plan.id) {
        return { text: "Updating...", disabled: true, variant: 'secondary' };
    }
    if (currentUser.membershipLevel === plan.name) {
        return { text: "Current Plan", disabled: true, variant: 'outline' };
    }
    
    const currentPlan = plans.find(p => p.name === currentUser.membershipLevel);
    const currentPlanPrice = currentPlan?.pricePerMonth ?? 0;
    const priceDifference = plan.pricePerMonth - currentPlanPrice;

    if (priceDifference > 0) {
      const diffText = currency ? `You will be charged an additional ${formatCurrency(priceDifference, currency)}/month.` : '';
      return { text: "Upgrade Plan", disabled: false, variant: 'default', priceDiffText: diffText };
    }
    
    if (priceDifference < 0) {
      const diffText = currency ? `Your monthly charge will be reduced by ${formatCurrency(Math.abs(priceDifference), currency)}.` : '';
      return { text: "Downgrade Plan", disabled: false, variant: 'secondary', priceDiffText: diffText };
    }

    return { text: "Switch Plan", disabled: false, variant: 'secondary' };
  }

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
        {plans.map((plan) => {
          const buttonState = getButtonState(plan);
          const isCurrentPlan = currentUser.membershipLevel === plan.name;
          const isMostPopular = plan.name === 'Premium'; // Hardcoded for design
          
          return (
          <Card 
            key={plan.id} 
            className={cn(`flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl relative`,
                        isMostPopular && !isCurrentPlan && 'border-primary border-2 scale-105 bg-background',
                        isCurrentPlan && 'border-green-500 border-2 bg-green-500/5'
            )}
          >
            {isMostPopular && !isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center z-10">
                    <Star className="w-4 h-4 mr-1 fill-current" /> Most Popular
                </div>
            )}
             {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center z-10">
                    <CheckCircle className="w-4 h-4 mr-1" /> Your Plan
                </div>
            )}
            <CardHeader className="text-center pt-10">
              <Award className={cn('mx-auto h-12 w-12 mb-4', isCurrentPlan ? 'text-green-500' : isMostPopular ? 'text-primary' : 'text-muted-foreground')} />
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
            <CardFooter className="mt-auto p-6 flex-col gap-2">
              <p className="text-xs text-center text-muted-foreground h-8 flex items-center justify-center">
                {buttonState.priceDiffText || ''}
              </p>
              <Button 
                className={cn('w-full text-lg py-6')}
                variant={buttonState.variant}
                onClick={() => handleSelectPlan(plan)}
                disabled={buttonState.disabled}
              >
                {isUpdating === plan.id && <LoadingSpinner size={20} className="mr-2" />}
                {buttonState.text}
              </Button>
            </CardFooter>
          </Card>
        );
        })}
      </div>
    </div>
  );
}
