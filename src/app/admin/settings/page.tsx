
'use client';

import { useState, useEffect } from 'react';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing, Globe, Construction } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getSiteSettings, updateSiteSettings } from '@/lib/data';
import type { SiteSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch initial settings
    setSettings(getSiteSettings());
  }, []);

  const handleGeneralSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsLoading(true);
    // In a real app, you would save these settings to your backend/database
    setTimeout(() => {
        updateSiteSettings(settings);
        setIsLoading(false);
        toast({
            title: 'Settings Saved',
            description: 'General site settings have been updated.',
        });
    }, 1000);
  };
  
  const handleInputChange = (key: keyof SiteSettings, value: string | boolean) => {
    if (settings) {
        setSettings({ ...settings, [key]: value });
    }
  };

  if (!settings) {
    return <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size={48} /></div>;
  }

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
          <CardContent>
            <form onSubmit={handleGeneralSettingsSubmit} className="space-y-6 pt-2">
                <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input 
                        id="siteName" 
                        value={settings.siteName}
                        onChange={(e) => handleInputChange('siteName', e.target.value)}
                        className="mt-1" 
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="currency">Default Currency</Label>
                        <Select 
                            value={settings.defaultCurrency} 
                            onValueChange={(value: SiteSettings['defaultCurrency']) => handleInputChange('defaultCurrency', value)}
                        >
                            <SelectTrigger id="currency" className="mt-1">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="INR">INR (₹)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select 
                            value={settings.timezone}
                            onValueChange={(value) => handleInputChange('timezone', value)}
                        >
                             <SelectTrigger id="timezone" className="mt-1">
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="maintenance-mode" className="text-base font-normal">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                            When enabled, only admins can access the site.
                        </p>
                    </div>
                    <Switch 
                        id="maintenance-mode" 
                        aria-label="Toggle maintenance mode"
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : "Save Settings"}
                    </Button>
                </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
