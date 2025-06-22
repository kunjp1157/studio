
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, CreditCard, BellRing, KeyRound, Globe, Construction, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const paymentGatewaySchema = z.object({
  provider: z.enum(['stripe', 'paypal', 'none']),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
  enabled: z.boolean().default(false),
}).refine(data => {
    if (data.provider !== 'none' && (!data.apiKey || !data.secretKey)) {
        return false;
    }
    return true;
}, {
    message: "API Key and Secret Key are required for the selected provider.",
    path: ["apiKey"], // Path to show the error message on one of the fields
});


type PaymentGatewayValues = z.infer<typeof paymentGatewaySchema>;


export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<PaymentGatewayValues>({
        resolver: zodResolver(paymentGatewaySchema),
        defaultValues: {
            provider: 'stripe',
            apiKey: 'pk_test_************************',
            secretKey: 'sk_test_************************',
            enabled: false,
        },
    });

    const onSubmit = (data: PaymentGatewayValues) => {
        setIsLoading(true);
        console.log('Saving payment gateway settings:', data);
        // In a real app, you would securely save these settings to your backend/database
        // and update environment variables or a configuration service.
        setTimeout(() => {
            setIsLoading(false);
            toast({
            title: 'Settings Saved',
            description: `Payment gateway settings for ${data.provider} have been updated.`,
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
              <CreditCard className="mr-2 h-6 w-6 text-primary" />
              Payment Gateway Settings
            </CardTitle>
            <CardDescription>
              Manage integrations with payment processors (e.g., Stripe, PayPal). Configure API keys and payment options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="provider"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Provider</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a payment provider" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="stripe">Stripe</SelectItem>
                                        <SelectItem value="paypal">PayPal</SelectItem>
                                        <SelectItem value="none">None</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Choose the payment provider to use for transactions.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    {form.watch('provider') !== 'none' && (
                        <>
                            <FormField
                                control={form.control}
                                name="apiKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>API Key / Public Key</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="pk_test_..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="secretKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Secret Key</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="enabled"
                                render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                    <FormLabel>Enable Gateway</FormLabel>
                                    <FormDescription>
                                        Enable this payment provider for checkout.
                                    </FormDescription>
                                    </div>
                                    <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                        </>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Form>
          </CardContent>
        </Card>

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
              <KeyRound className="mr-2 h-6 w-6 text-primary" />
              API Key Management
            </CardTitle>
            <CardDescription>
              Manage API keys for third-party integrations (e.g., Google Maps, AI services, analytics platforms).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[150px] text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-md font-semibold text-muted-foreground">Configuration Coming Soon</h3>
            <p className="text-sm text-muted-foreground mt-1">
             A secure interface to manage keys for external services will be here.
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
              Configure global site settings such as site name, default currency, timezone, and maintenance mode.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[150px] text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-md font-semibold text-muted-foreground">Configuration Coming Soon</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Options for general site configuration, like site identity and regional settings, are planned.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
