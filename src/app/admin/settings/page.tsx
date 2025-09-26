
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing, Globe, Construction, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { updateSiteSettings, getSiteSettingsAction } from '@/app/actions';
import type { SiteSettings, NotificationTemplate, NotificationType } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';

const settingsFormSchema = z.object({
  siteName: z.string().min(3, { message: "Site name must be at least 3 characters." }),
  defaultCurrency: z.enum(['USD', 'EUR', 'GBP', 'INR']),
  timezone: z.string().min(1, { message: "Please select a timezone." }),
  maintenanceMode: z.boolean(),
});
type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const notificationTemplateSchema = z.object({
    type: z.string(), // Keep as string for hidden value
    label: z.string(), // Display only
    description: z.string(), // Display only
    emailEnabled: z.boolean(),
    smsEnabled: z.boolean(),
    emailSubject: z.string().min(1, "Email subject cannot be empty if email is enabled."),
    emailBody: z.string().min(1, "Email body cannot be empty if email is enabled."),
    smsBody: z.string().optional(),
});
const notificationsFormSchema = z.object({
  templates: z.array(notificationTemplateSchema)
});
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;


export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    // defaultValues are set in useEffect to prevent render-time updates
  });
  
  const notificationForm = useForm<NotificationsFormValues>({
      resolver: zodResolver(notificationsFormSchema),
      // defaultValues are set in useEffect
  });

  useEffect(() => {
    const initializeForm = async () => {
        const currentSettings = await getSiteSettingsAction();
        form.reset(currentSettings);
        notificationForm.reset({ templates: currentSettings.notificationTemplates || [] });
        setIsFormInitialized(true);
    };
    initializeForm();
  }, [form, notificationForm]);
  

  const { fields } = useFieldArray({
      control: notificationForm.control,
      name: "templates"
  });

  useEffect(() => {
    const handleSettingsUpdate = async () => {
        const currentSettings = await getSiteSettingsAction();
        form.reset(currentSettings);
        notificationForm.reset({ templates: currentSettings.notificationTemplates });
        toast({
            title: 'Settings Updated Live',
            description: 'Another admin updated the site settings. Your form has been refreshed.',
        });
    };
    
    window.addEventListener('settingsChanged', handleSettingsUpdate);
    
    return () => {
        window.removeEventListener('settingsChanged', handleSettingsUpdate);
    };
  }, [form, notificationForm, toast]);

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);
    const currentSettings = await getSiteSettingsAction();
    // This is a mock update as we don't have a DB for settings yet
    console.log("Updating settings:", { ...currentSettings, ...data });
    window.dispatchEvent(new CustomEvent('settingsChanged'));
    setIsLoading(false);
    toast({
        title: 'Settings Saved',
        description: 'General site settings have been updated.',
    });
  };

  const onNotificationSubmit = async (data: NotificationsFormValues) => {
    setIsNotificationLoading(true);
    const currentSettings = await getSiteSettingsAction();
    const templates = data.templates.map(t => ({ ...t, type: t.type as NotificationType }));
    // This is a mock update
    console.log("Updating notification templates:", { ...currentSettings, notificationTemplates: templates });
    window.dispatchEvent(new CustomEvent('settingsChanged'));
    setIsNotificationLoading(false);
    toast({
        title: 'Notification Settings Saved',
        description: 'Notification templates and triggers have been updated.',
    });
  };

  if (!isFormInitialized) {
      return (
          <div className="flex justify-center items-center h-96">
              <LoadingSpinner size={48} />
          </div>
      )
  }
  
  return (
    <div className="space-y-8">
      <PageTitle title="System Settings" description="Configure general settings for the Sports Arena platform." />

      <div className="grid md:grid-cols-2 gap-8 items-start">
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
          <CardContent>
             <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                <Accordion type="multiple" className="w-full">
                  {fields.map((field, index) => (
                    <AccordionItem key={field.id} value={field.type}>
                      <AccordionTrigger>
                        <div className="flex flex-col text-left">
                            <span className="font-semibold">{field.label}</span>
                            <span className="text-xs text-muted-foreground font-normal">{field.description}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={notificationForm.control} name={`templates.${index}.emailEnabled`} render={({ field: switchField }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-sm font-normal flex items-center"><Mail className="mr-2 h-4 w-4"/> Email</FormLabel>
                                    </div>
                                    <FormControl><Switch checked={switchField.value} onCheckedChange={switchField.onChange} /></FormControl>
                                </FormItem>
                            )} />
                             <FormField control={notificationForm.control} name={`templates.${index}.smsEnabled`} render={({ field: switchField }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-sm font-normal flex items-center"><MessageSquare className="mr-2 h-4 w-4"/> SMS</FormLabel>
                                    </div>
                                    <FormControl><Switch checked={switchField.value} onCheckedChange={switchField.onChange} /></FormControl>
                                </FormItem>
                            )} />
                        </div>
                         <FormField control={notificationForm.control} name={`templates.${index}.emailSubject`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Subject</FormLabel>
                                <FormControl><Input placeholder="Subject line for the email..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={notificationForm.control} name={`templates.${index}.emailBody`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Body</FormLabel>
                                <FormControl><Textarea placeholder="Body of the email. You can use placeholders like {{userName}}." {...field} rows={4} /></FormControl>
                                <FormDescription className="text-xs">Available placeholders: {{userName}}, {{facilityName}}, {{date}}, {{time}}, {{bookingId}}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={notificationForm.control} name={`templates.${index}.smsBody`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>SMS Body</FormLabel>
                                <FormControl><Input placeholder="SMS message content..." {...field} /></FormControl>
                                <FormDescription className="text-xs">Keep it short and concise for SMS.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isNotificationLoading}>
                        {isNotificationLoading ? <LoadingSpinner size={20} className="mr-2" /> : "Save Notification Settings"}
                    </Button>
                </div>
              </form>
            </Form>
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
