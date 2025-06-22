
'use client';

import { useState } from 'react';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing, Globe, Construction } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
