
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { MembershipPlan, SiteSettings } from '@/lib/types';
import { addMembershipPlan, updateMembershipPlan, getSiteSettings } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Save, ArrowLeft, DollarSign, ListChecks, Award } from 'lucide-react';

const membershipPlanFormSchema = z.object({
  name: z.string().min(3, { message: "Plan name must be at least 3 characters." }),
  pricePerMonth: z.coerce.number().min(0, { message: "Price must be a non-negative number." }),
  benefitsString: z.string().min(1, { message: "Please list at least one benefit." }),
});

type MembershipPlanFormValues = z.infer<typeof membershipPlanFormSchema>;

interface MembershipAdminFormProps {
  initialData?: MembershipPlan | null;
  onSubmitSuccess?: () => void;
}

export function MembershipAdminForm({ initialData, onSubmitSuccess }: MembershipAdminFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  useEffect(() => {
    const settingsInterval = setInterval(() => {
      const currentSettings = getSiteSettings();
      setCurrency(prev => currentSettings.defaultCurrency !== prev ? currentSettings.defaultCurrency : prev);
    }, 3000);

    const currentSettings = getSiteSettings();
    setCurrency(currentSettings.defaultCurrency);

    return () => clearInterval(settingsInterval);
  }, []);

  const form = useForm<MembershipPlanFormValues>({
    resolver: zodResolver(membershipPlanFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      pricePerMonth: initialData.pricePerMonth,
      benefitsString: initialData.benefits.join('\n'),
    } : {
      name: '',
      pricePerMonth: 0,
      benefitsString: '',
    },
  });

  const onSubmit = async (data: MembershipPlanFormValues) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    const benefitsArray = data.benefitsString.split('\n').map(b => b.trim()).filter(b => b.length > 0);

    const planPayload = {
      id: initialData?.id || `mem-${Date.now()}`, // Keep ID if editing, generate if new
      name: data.name,
      pricePerMonth: data.pricePerMonth,
      benefits: benefitsArray,
    };

    try {
      if (initialData) {
        updateMembershipPlan(planPayload as MembershipPlan);
      } else {
        addMembershipPlan(planPayload as Omit<MembershipPlan, 'id'>);
      }

      toast({
        title: initialData ? "Membership Plan Updated" : "Membership Plan Created",
        description: `${planPayload.name} has been successfully ${initialData ? 'updated' : 'created'}.`,
      });

      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        router.push('/admin/memberships');
        router.refresh();
      }
    } catch (error) {
      console.error("Error saving membership plan:", error);
      toast({
        title: "Error",
        description: "Failed to save membership plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Button type="button" variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Membership Plans
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" />
              {initialData ? `Edit: ${initialData.name}` : 'Add New Membership Plan'}
            </CardTitle>
            <CardDescription>Fill in the details for the membership plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Gold Tier" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" /> Price Per Month ({currency})
                  </FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="29.99" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefitsString"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <ListChecks className="mr-2 h-4 w-4 text-muted-foreground" /> Benefits
                  </FormLabel>
                  <FormControl><Textarea placeholder="Enter each benefit on a new line..." {...field} rows={5} /></FormControl>
                  <FormDescription>List all benefits included in this plan, one per line.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/memberships')} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            {initialData ? 'Save Changes' : 'Create Plan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
