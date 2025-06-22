
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing, Globe, Construction } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getSiteSettings, updateSiteSettings } from '@/lib/data';
import type { SiteSettings } from '@/lib/types';

const settingsFormSchema = z.object({
  siteName: z.string().min(3, { message: "Site name must be at least 3 characters." }),
  defaultCurrency: z.enum(['USD', 'EUR', 'GBP', 'INR']),
  timezone: z.string().min(1, { message: "Please select a timezone." }),
  maintenanceMode: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// Simple deep object comparison function to avoid adding dependencies
const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
};

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: getSiteSettings(),
  });

  // Polling for live updates for other admins
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentSettings = getSiteSettings();
      const formValues = form.getValues();
      
      if (!deepEqual(currentSettings, formValues)) {
        form.reset(currentSettings);
        toast({
            title: 'Settings Updated Live',
            description: 'Another admin updated the settings.',
        });
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId);
  }, [form, toast]);

  const onSubmit = (data: SettingsFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
        updateSiteSettings(data);
        setIsLoading(false);
        toast({
            title: 'Settings Saved',
            description: 'General site settings have been updated.',
        });
    }, 1000);
  };
  
  return (
    <div className="space-y-8">
      <PageTitle title="System Settings" description="Configure general settings for the City Sports Hub platform." />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BellRing className="mr-2 h-6 w-6 text-primary" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Customize email and SMS notification templates, and configure notification triggers and delivery settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[150px] text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-md font-semibold text-muted-foreground">Configuration Coming Soon</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Notification management tools are under development.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-6 w-6 text-primary" />
              General Site Settings
            </CardTitle>
            <CardDescription>
              This form is live. Changes made by another admin will appear here automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
                <FormField control={form.control} name="siteName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="defaultCurrency" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Default Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="INR">INR (₹)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="timezone" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60">
                                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )} />
                 </div>
                 <FormField control={form.control} name="maintenanceMode" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base font-normal">Maintenance Mode</FormLabel>
                            <FormDescription>When enabled, only admins can access the site.</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                 )} />
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : "Save Settings"}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
