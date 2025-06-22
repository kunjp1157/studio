
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Building, Ticket, DollarSign, Users, Construction } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';
import { getSiteSettings } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function OwnerDashboardPage() {
  // Mock data for display - in a real app, this would be fetched for the logged-in owner
  const ownerStats = {
    activeListings: 2,
    totalBookingsThisMonth: 35,
    upcomingBookings: 8,
    monthlyRevenue: 1250.75,
    newReviews: 5,
  };

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

  return (
    <div className="space-y-8">
      <PageTitle title="Owner Dashboard" description="Overview of your facilities and performance." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Facility Listings</CardTitle>
            <Building className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownerStats.activeListings}</div>
            <p className="text-xs text-muted-foreground">Currently managed by you</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings This Month</CardTitle>
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownerStats.totalBookingsThisMonth}</div>
            <p className="text-xs text-muted-foreground">+10% from last month (mock)</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Revenue (Month)</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currency ? formatCurrency(ownerStats.monthlyRevenue, currency) : <Skeleton className="h-8 w-28" />}
            </div>
            <p className="text-xs text-muted-foreground">Based on confirmed bookings</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Construction className="mr-2 h-6 w-6 text-primary" />
            More Tools Coming Soon!
          </CardTitle>
          <CardDescription>
            This portal will soon allow you to manage your facility details, photos, real-time slot availability, view detailed booking reports, and much more.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[200px] text-center">
          <p className="text-muted-foreground mt-2">
            We are actively developing features to empower facility owners. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
