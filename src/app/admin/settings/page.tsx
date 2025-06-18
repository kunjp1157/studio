'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Construction } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="System Settings" description="Configure general settings for the City Sports Hub platform." />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-6 w-6 text-primary" />
            Platform Configuration
          </CardTitle>
          <CardDescription>
            This area will allow administrators to manage core system settings, such as payment gateway integrations, notification templates, API keys, and other global configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
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
