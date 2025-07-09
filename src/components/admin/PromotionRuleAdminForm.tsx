
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { PromotionRule } from '@/lib/types';
import { addPromotionRule, updatePromotionRule } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Save, ArrowLeft, DollarSign, Percent, CalendarDays, Tag, Info, Edit, Hash, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

const promotionRuleFormSchema = z.object({
  name: z.string().min(3, { message: "Promotion name must be at least 3 characters." }),
  description: z.string().optional(),
  code: z.string().optional().transform(val => val?.toUpperCase() || undefined),
  discountType: z.enum(['percentage', 'fixed_amount']),
  discountValue: z.coerce.number().min(0, { message: "Discount value must be non-negative." }),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  usageLimit: z.coerce.number().int().min(0).optional().default(0),
  usageLimitPerUser: z.coerce.number().int().min(0).optional().default(0),
  isActive: z.boolean().default(true),
}).refine(data => {
    if (data.startDate && data.endDate && data.endDate < data.startDate) return false;
    return true;
}, { message: "End date cannot be before start date.", path: ["endDate"] });


type PromotionRuleFormValues = z.infer<typeof promotionRuleFormSchema>;

interface PromotionRuleAdminFormProps {
  initialData?: PromotionRule | null;
}

export function PromotionRuleAdminForm({ initialData }: PromotionRuleAdminFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PromotionRuleFormValues>({
    resolver: zodResolver(promotionRuleFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      code: initialData.code ?? '',
      startDate: initialData.startDate ? parseISO(initialData.startDate) : undefined,
      endDate: initialData.endDate ? parseISO(initialData.endDate) : undefined,
      usageLimit: initialData.usageLimit ?? 0,
      usageLimitPerUser: initialData.usageLimitPerUser ?? 0,
    } : {
      name: '',
      description: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      startDate: undefined,
      endDate: undefined,
      usageLimit: 0,
      usageLimitPerUser: 0,
      isActive: true,
    },
  });

  const onSubmit = async (data: PromotionRuleFormValues) => {
    setIsLoading(true);

    const payload = {
      name: data.name,
      description: data.description,
      isActive: data.isActive,
      discountType: data.discountType,
      discountValue: data.discountValue,
      code: data.code || undefined, // Ensure empty string becomes undefined
      startDate: data.startDate ? data.startDate.toISOString().split('T')[0] : undefined,
      endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : undefined,
      usageLimit: data.usageLimit === 0 ? undefined : data.usageLimit, // 0 means unlimited
      usageLimitPerUser: data.usageLimitPerUser === 0 ? undefined : data.usageLimitPerUser, // 0 means unlimited
    };

    try {
      if (initialData) {
        await updatePromotionRule({ ...payload, id: initialData.id });
      } else {
        await addPromotionRule(payload);
      }
      toast({
        title: initialData ? "Promotion Updated" : "Promotion Created",
        description: `Promotion "${payload.name}" has been successfully saved.`,
      });
      router.push('/admin/promotions');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save promotion. Please try again.",
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Promotions
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Edit className="mr-2 h-5 w-5 text-primary" />
              {initialData ? `Edit Promotion: ${initialData.name}` : 'Add New Promotion Rule'}
            </CardTitle>
            <CardDescription>Configure the details for this promotional offer or coupon.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-muted-foreground"/>Promotion Name</FormLabel><FormControl><Input placeholder="e.g., Summer Splash Sale" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-muted-foreground"/>Description (Optional)</FormLabel><FormControl><Textarea placeholder="Details about the promotion" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="code" render={({ field }) => (
              <FormItem><FormLabel className="flex items-center"><Hash className="mr-2 h-4 w-4 text-muted-foreground"/>Coupon Code (Optional)</FormLabel><FormControl><Input placeholder="e.g., SUMMER20 (leave blank for automatic)" {...field} /></FormControl>
              <FormDescription>If left blank, this promotion might apply automatically based on other (future) conditions.</FormDescription><FormMessage /></FormItem>
            )} />
            
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="discountType" render={({ field }) => (
                <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select discount type" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="percentage"><Percent className="mr-2 h-4 w-4 inline-block" />Percentage Off</SelectItem>
                        <SelectItem value="fixed_amount"><DollarSign className="mr-2 h-4 w-4 inline-block" />Fixed Amount Off</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )} />
                <FormField control={form.control} name="discountValue" render={({ field }) => (
                <FormItem>
                    <FormLabel>Discount Value</FormLabel>
                    <FormControl><Input type="number" step="any" placeholder="e.g., 15 or 10.50" {...field} /></FormControl>
                    <FormDescription>Enter percentage (e.g., 15 for 15%) or monetary value.</FormDescription>
                    <FormMessage />
                </FormItem>
                )} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="startDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>Start Date (Optional)</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="endDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>End Date (Optional)</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => form.getValues("startDate") ? date < form.getValues("startDate")! : false} initialFocus />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            
             <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="usageLimit" render={({ field }) => (
                <FormItem><FormLabel>Total Usage Limit (Optional)</FormLabel><FormControl><Input type="number" placeholder="0 for unlimited" {...field} /></FormControl>
                <FormDescription>Max number of times this promotion can be used overall.</FormDescription><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="usageLimitPerUser" render={({ field }) => (
                <FormItem><FormLabel>Usage Limit Per User (Optional)</FormLabel><FormControl><Input type="number" placeholder="0 for unlimited" {...field} /></FormControl>
                <FormDescription>Max number of times a single user can use this promotion.</FormDescription><FormMessage /></FormItem>
                )} />
            </div>
            
            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base flex items-center"><Check className="mr-2 h-4 w-4 text-muted-foreground"/>Activate Promotion</FormLabel>
                  <FormDescription>If unchecked, this promotion will not be available.</FormDescription>
                </div>
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/promotions')} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            {initialData ? 'Save Changes' : 'Create Promotion'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
