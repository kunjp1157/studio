
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { MembershipPlan, SiteSettings, UserProfile } from '@/lib/types';
import { mockMembershipPlans, mockUser, updateUser } from '@/lib/data';
import { getSiteSettingsAction } from '@/app/actions';
import { Award, CheckCircle, Star, CreditCard, HandCoins, QrCode, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Simple UPI Icon component (re-using from booking page)
const UpiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5">
        <path d="M6.46 9.36L4.7 11.12L3 9.46L4.76 7.7L6.46 9.36ZM10 10.9V7.1H8V15H10V12.7C11.39 12.7 12.5 11.94 12.5 10.2C12.5 8.76 11.5 7.6 10 7.6C8.5 7.6 7.5 8.76 7.5 10.2C7.5 11.94 8.61 12.7 10 12.7V10.9H10ZM10 9.4H10.5C10.94 9.4 11.2 9.7 11.2 10.1C11.2 10.5 10.94 10.8 10.5 10.8H10V9.4ZM17.1 7.1L15 11.5L12.9 7.1H11V15H12.9V10.7L14.4 14H15.6L17.1 10.7V15H19V7.1H17.1Z" fill="#1A237E"/>
        <path d="M21 9.46L19.3 11.12L21 12.78L22.76 11.12L21 9.46Z" fill="#1A237E"/>
    </svg>
);


export default function MembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUser);
  const { toast } = useToast();
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<MembershipPlan | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'qr'>('card');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
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

  useEffect(() => {
    setCurrentUser(mockUser);
  }, [mockUser.membershipLevel]);

  const handleChoosePlan = (plan: MembershipPlan) => {
    setSelectedPlanForPayment(plan);
    setIsPaymentDialogOpen(true);
  };
  
  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForPayment) return;

    if (paymentMethod === 'upi' && !upiId.trim()) {
        toast({ title: 'UPI ID Required', description: 'Please enter your UPI ID.', variant: 'destructive' });
        return;
    }
    
    setIsProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    updateUser(currentUser.id, { membershipLevel: selectedPlanForPayment.name as 'Basic' | 'Premium' | 'Pro' });
    setCurrentUser(prev => ({...prev, membershipLevel: selectedPlanForPayment.name as 'Basic' | 'Premium' | 'Pro' }));
    
    toast({
        title: "Membership Updated!",
        description: `You are now on the ${selectedPlanForPayment.name} plan.`,
        className: 'bg-green-500 text-white'
    });
    
    setIsProcessingPayment(false);
    setIsPaymentDialogOpen(false);
    setSelectedPlanForPayment(null);
  };
  
  const getButtonState = (plan: MembershipPlan): { 
      text: string; 
      disabled: boolean; 
      variant: "default" | "secondary" | "outline";
    } => {
    if (isProcessingPayment) {
        return { text: "Processing...", disabled: true, variant: 'secondary' };
    }
    if (currentUser.membershipLevel === plan.name) {
        return { text: "Current Plan", disabled: true, variant: 'outline' };
    }
    
    const currentPlan = plans.find(p => p.name === currentUser.membershipLevel);
    const currentPlanPrice = currentPlan?.pricePerMonth ?? 0;
    const priceDifference = plan.pricePerMonth - currentPlanPrice;

    if (priceDifference > 0) {
      return { text: "Upgrade Plan", disabled: false, variant: 'default' };
    }
    
    if (priceDifference < 0) {
      return { text: "Downgrade Plan", disabled: false, variant: 'secondary' };
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

  const currentPlanPrice = plans.find(p => p.name === currentUser.membershipLevel)?.pricePerMonth ?? 0;
  const priceDifference = selectedPlanForPayment ? selectedPlanForPayment.pricePerMonth - currentPlanPrice : 0;
  
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
          const isMostPopular = plan.name === 'Premium';
          
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
              <Button 
                className={cn('w-full text-lg py-6')}
                variant={buttonState.variant}
                onClick={() => handleChoosePlan(plan)}
                disabled={buttonState.disabled}
              >
                {buttonState.text}
              </Button>
            </CardFooter>
          </Card>
        );
        })}
      </div>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Membership Change</DialogTitle>
              {selectedPlanForPayment && (
                <DialogDescription>
                  You are about to {priceDifference > 0 ? 'upgrade to' : 'downgrade to'} the <strong>{selectedPlanForPayment.name}</strong> plan.
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="py-4">
              <form onSubmit={handleConfirmPayment}>
                {priceDifference !== 0 && currency && (
                   <Alert className="mb-4">
                      <AlertTitle>{priceDifference > 0 ? 'Upgrade Cost' : 'Plan Change Summary'}</AlertTitle>
                      <AlertDescription>
                        {priceDifference > 0 ? `Your first prorated payment will be ${formatCurrency(priceDifference, currency)}.` : `Your plan will be downgraded at the next billing cycle.`}
                      </AlertDescription>
                  </Alert>
                )}
                 {priceDifference > 0 && (
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'upi' | 'qr')}>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center text-base"><CreditCard className="mr-2 h-5 w-5"/> Use saved Credit/Debit Card</Label>
                      </div>
                       <div className="flex items-center space-x-2 border p-4 rounded-md">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex items-center text-base"><UpiIcon /> UPI</Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                          <RadioGroupItem value="qr" id="mem-qr" />
                          <Label htmlFor="mem-qr" className="flex items-center text-base"><QrCode className="mr-2 h-5 w-5"/> Scan QR Code</Label>
                      </div>
                  </RadioGroup>
                )}
                {priceDifference > 0 && paymentMethod === 'upi' && (
                     <div className="mt-4">
                        <Label htmlFor="upi-id">UPI ID</Label>
                        <Input 
                            id="upi-id" 
                            type="text" 
                            placeholder="yourname@bank" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required 
                        />
                    </div>
                )}
                 {priceDifference > 0 && paymentMethod === 'qr' && currency && (
                     <div className="mt-4 space-y-4 pt-4 border-t text-center">
                        <p className="text-sm text-muted-foreground">Scan the QR code to pay for your upgrade.</p>
                        <div className="flex justify-center">
                            <Image
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=mock-merchant@upi&pn=Sports%20Arena%20Membership&am=${priceDifference.toFixed(2)}&cu=${currency}`}
                                alt="Scan to pay for membership"
                                width={180}
                                height={180}
                                className="rounded-md border"
                            />
                        </div>
                         <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>After Payment</AlertTitle>
                            <AlertDescription>
                                Once your payment is complete, click the button below to confirm your new membership plan.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)} disabled={isProcessingPayment}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isProcessingPayment}>
                    {isProcessingPayment && <LoadingSpinner size={20} className="mr-2" />}
                    {isProcessingPayment ? 'Processing...' : (priceDifference <= 0 ? 'Confirm Change' : (paymentMethod === 'qr' ? 'Confirm Payment' : 'Confirm & Pay'))}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}
