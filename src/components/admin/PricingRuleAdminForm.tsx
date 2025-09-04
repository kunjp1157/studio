
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { PricingRule } from '@/lib/types';
import { addPricingRuleAction, updatePricingRuleAction } from '@/app/actions';
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
import { Save, ArrowLeft, DollarSign, Percent, CalendarDays, Clock, AlertTriangle, Tag, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format

const pricingRuleFormSchema = z.object({
  name: z.string().min(3, { message: "Rule name must be at least 3 characters." }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  adjustmentType: z.enum([
    'percentage_increase', 
    'percentage_decrease', 
    'fixed_increase', 
    'fixed_decrease', 
    'fixed_price'
  ]),
  value: z.coerce.number().min(0, { message: "Value must be non-negative." }),
  priority: z.coerce.number().optional(),
  daysOfWeek: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).optional(),
  timeRangeStart: z.string().optional().refine(val => !val || timeRegex.test(val), { message: "Invalid start time (HH:MM)"}),
  timeRangeEnd: z.string().optional().refine(val => !val || timeRegex.test(val), { message: "Invalid end time (HH:MM)"}),
  dateRangeStart: z.date().optional(),
  dateRangeEnd: z.date().optional(),
}).refine(data => {
    if (data.timeRangeStart && !data.timeRangeEnd) return false;
    if (!data.timeRangeStart && data.timeRangeEnd) return false;
    if (data.timeRangeStart && data.timeRangeEnd && data.timeRangeEnd < data.timeRangeStart) return false; // Basic time check
    return true;
}, { message: "End time must be after start time, and both must be provided if one is.", path: ["timeRangeEnd"] })
.refine(data => {
    if (data.dateRangeStart && !data.dateRangeEnd) return false;
    if (!data.dateRangeStart && data.dateRangeEnd) return false;
    if (data.dateRangeStart && data.dateRangeEnd && data.dateRangeEnd < data.dateRangeStart) return false;
    return true;
}, { message: "End date must be after start date, and both must be provided if one is.", path: ["dateRangeEnd"] });


type PricingRuleFormValues = z.infer<typeof pricingRuleFormSchema>;

const days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface PricingRuleAdminFormProps {
  initialData?: PricingRule | null;
}

export function PricingRuleAdminForm({ initialData }: PricingRuleAdminFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PricingRuleFormValues>({
    resolver: zodResolver(pricingRuleFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      priority: initialData.priority ?? undefined,
      daysOfWeek: initialData.daysOfWeek ?? [],
      timeRangeStart: initialData.timeRange?.start ?? '',
      timeRangeEnd: initialData.timeRange?.end ?? '',
      dateRangeStart: initialData.dateRange?.start ? parseISO(initialData.dateRange.start) : undefined,
      dateRangeEnd: initialData.dateRange?.end ? parseISO(initialData.dateRange.end) : undefined,
    } : {
      name: '',
      description: '',
      isActive: true,
      adjustmentType: 'percentage_increase',
      value: 0,
      priority: undefined,
      daysOfWeek: [],
      timeRangeStart: '',
      timeRangeEnd: '',
      dateRangeStart: undefined,
      dateRangeEnd: undefined,
    },
  });

  const onSubmit = async (data: PricingRuleFormValues) => {
    setIsLoading(true);

    const payload = {
      name: data.name,
      description: data.description,
      isActive: data.isActive,
      adjustmentType: data.adjustmentType,
      value: data.value,
      priority: data.priority,
      daysOfWeek: data.daysOfWeek?.length ? data.daysOfWeek : undefined,
      timeRange: data.timeRangeStart && data.timeRangeEnd ? { start: data.timeRangeStart, end: data.timeRangeEnd } : undefined,
      dateRange: data.dateRangeStart && data.dateRangeEnd ? { start: data.dateRangeStart.toISOString().split('T')[0], end: data.dateRangeEnd.toISOString().split('T')[0] } : undefined,
    };

    try {
      if (initialData) {
        await updatePricingRuleAction({ ...payload, id: initialData.id });
      } else {
        await addPricingRuleAction(payload);
      }
      toast({
        title: initialData ? "Pricing Rule Updated" : "Pricing Rule Created",
        description: `Rule "${payload.name}" has been successfully saved.`,
      });
      router.push('/admin/pricing');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pricing rule. Please try again.",
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pricing Rules
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="mr-2 h-5 w-5 text-primary" />
              {initialData ? `Edit Rule: ${initialData.name}` : 'Add New Pricing Rule'}
            </CardTitle>
            <CardDescription>Define the conditions and adjustments for this pricing rule.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Rule Name</FormLabel><FormControl><Input placeholder="e.g., Weekend Evening Surge" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea placeholder="Describe when and why this rule applies" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="adjustmentType" render={({ field }) => (
                <FormItem>
                    <FormLabel>Adjustment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select adjustment type" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="percentage_increase">Percentage Increase</SelectItem>
                        <SelectItem value="percentage_decrease">Percentage Decrease</SelectItem>
                        <SelectItem value="fixed_increase">Fixed Amount Increase</SelectItem>
                        <SelectItem value="fixed_decrease">Fixed Amount Decrease</SelectItem>
                        <SelectItem value="fixed_price">Set Fixed Price</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )} />
                <FormField control={form.control} name="value" render={({ field }) => (
                <FormItem>
                    <FormLabel>Adjustment Value</FormLabel>
                    <FormControl><Input type="number" step="any" placeholder="e.g., 10 or 15.50" {...field} /></FormControl>
                    <FormDescription>Enter percentage (e.g., 10 for 10%) or monetary value.</FormDescription>
                    <FormMessage />
                </FormItem>
                )} />
            </div>

            <FormField control={form.control} name="priority" render={({ field }) => (
              <FormItem><FormLabel>Priority (Optional)</FormLabel><FormControl><Input type="number" placeholder="e.g., 10 (lower numbers apply first)" {...field} /></FormControl>
              <FormDescription>If multiple rules match, the one with the lower priority number takes precedence.</FormDescription><FormMessage /></FormItem>
            )} />

            <Card>
                <CardHeader><CardTitle className="text-base">Conditions (Optional)</CardTitle><CardDescription>Define when this rule should apply. Leave blank if it applies generally.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="daysOfWeek" render={() => (
                        <FormItem>
                            <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Days of the Week</FormLabel>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 p-2 border rounded-md">
                            {days.map(day => (
                                <FormField key={day} control={form.control} name="daysOfWeek" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><Checkbox 
                                        checked={field.value?.includes(day)}
                                        onCheckedChange={checked => {
                                            const currentDays = field.value || [];
                                            return checked ? field.onChange([...currentDays, day]) : field.onChange(currentDays.filter(d => d !== day));
                                        }}
                                    /></FormControl>
                                    <FormLabel className="font-normal">{day}</FormLabel>
                                </FormItem>
                                )} />
                            ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="timeRangeStart" render={({ field }) => (
                        <FormItem><FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4"/>Start Time (HH:MM)</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="timeRangeEnd" render={({ field }) => (
                        <FormItem><FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4"/>End Time (HH:MM)</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="dateRangeStart" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Date Range Start</FormLabel>
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
                         <FormField control={form.control} name="dateRangeEnd" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Date Range End</FormLabel>
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
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => form.getValues("dateRangeStart") ? date < form.getValues("dateRangeStart")! : false} initialFocus />
                                </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </CardContent>
            </Card>
            
            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Activate Rule</FormLabel>
                  <FormDescription>If unchecked, this rule will not be applied.</FormDescription>
                </div>
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/pricing')} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            {initialData ? 'Save Changes' : 'Create Rule'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
