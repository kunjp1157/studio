
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, CreditCard, BellRing, KeyRound, Globe, Construction } from 'lucide-react';

export default function AdminSettingsPage() {
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
          <CardContent className="flex flex-col items-center justify-center min-h-[150px] text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-md font-semibold text-muted-foreground">Configuration Coming Soon</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed payment gateway settings will be available here.
            </p>
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
              Interface to manage API keys for external services will be implemented here.
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

       <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-6 w-6 text-primary" />
            Overall Platform Configuration (Original Placeholder)
          </CardTitle>
          <CardDescription>
            This area will allow administrators to manage core system settings, such as payment gateway integrations, notification templates, API keys, and other global configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[200px] text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Settings Panel Under Construction</h3>
          <p className="text-muted-foreground mt-2">
            System configuration options are currently being developed. Please check back later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
