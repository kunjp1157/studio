
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Building, Ticket, DollarSign, Users, Construction } from 'lucide-react';
import type { SiteSettings, Booking, Facility } from '@/lib/types';
import { getSiteSettings, listenToOwnerBookings, mockUser, getFacilitiesByOwnerId } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getMonth, getYear, parseISO, isAfter } from 'date-fns';

export default function OwnerDashboardPage() {
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ownerId = mockUser.id; // In a real app, get this from auth state

  useEffect(() => {
    const settings = getSiteSettings();
    setCurrency(settings.defaultCurrency);
    
    let unsubscribeBookings = () => {};
    let unsubscribeFacilities = () => {};

    if (ownerId) {
      const setupListeners = async () => {
        const ownerFacilities = await getFacilitiesByOwnerId(ownerId);
        setFacilities(ownerFacilities);

        unsubscribeBookings = await listenToOwnerBookings(
          ownerId,
          (ownerBookings) => {
            setBookings(ownerBookings);
            if(isLoading) setIsLoading(false);
          },
          (error) => {
            console.error("Error listening to owner bookings:", error);
            if(isLoading) setIsLoading(false);
          }
        );
      }
      setupListeners();
    }
    
    return () => {
        unsubscribeBookings();
    };
  }, [ownerId, isLoading]);


  const ownerStats = bookings.reduce((acc, booking) => {
      const bookingDate = parseISO(booking.bookedAt);
      const now = new Date();
      
      if (booking.status === 'Confirmed') {
        acc.totalBookings += 1;
        if (getMonth(bookingDate) === getMonth(now) && getYear(bookingDate) === getYear(now)) {
            acc.totalBookingsThisMonth += 1;
            acc.monthlyRevenue += booking.totalPrice;
        }
      }
      if (booking.status === 'Confirmed' && isAfter(parseISO(booking.date), now)) {
          acc.upcomingBookings += 1;
      }
      return acc;
  }, {
      totalBookingsThisMonth: 0,
      monthlyRevenue: 0,
      upcomingBookings: 0,
      totalBookings: 0,
  });

  return (
    <div className="space-y-8">
      <PageTitle title="Owner Dashboard" description="Overview of your facilities and performance." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Facilities</CardTitle>
            <Building className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : facilities.length}</div>
            <p className="text-xs text-muted-foreground">Total facilities managed</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings This Month</CardTitle>
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : ownerStats.totalBookingsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Live data for current month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (This Month)</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading || !currency ? <Skeleton className="h-8 w-28" /> : formatCurrency(ownerStats.monthlyRevenue, currency)}
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
