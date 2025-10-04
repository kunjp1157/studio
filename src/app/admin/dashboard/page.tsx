

'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import {
  getSiteSettingsAction
} from '@/app/actions';
import { getAllBookingsAction, getUsersAction, getFacilitiesAction } from '@/app/actions';
import { DollarSign, Users, TrendingUp, Ticket, Building2, Activity, UserPlus, Clock } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';
import { parseISO, getMonth, getYear, format, subMonths, formatDistanceToNow, isSameDay, isWithinInterval } from 'date-fns';
import type { Booking, UserProfile, Facility, SiteSettings } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';


const revenueChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const popularSportsChartConfig = {
  bookings: { label: 'Bookings', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

// Define a unified activity item type
interface ActivityFeedItemType {
  type: 'booking' | 'newUser';
  timestamp: string | Date; // Can be ISO string or Date object
  user: UserProfile | undefined;
  bookingData?: Booking;
  facility?: Facility | undefined;
}

// A sub-component to render each item in the feed
const ActivityItem = ({ item, currency }: { item: ActivityFeedItemType, currency: SiteSettings['defaultCurrency'] | null }) => {
  if (!item.user) return null;

  const dateToFormat = typeof item.timestamp === 'string' ? parseISO(item.timestamp) : item.timestamp;
  const timeAgo = formatDistanceToNow(dateToFormat, { addSuffix: true });


  if (item.type === 'booking' && item.bookingData && item.facility) {
    return (
      <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
        <Avatar className="h-9 w-9 border">
          <AvatarImage src={item.user.profilePictureUrl} alt={item.user.name} />
          <AvatarFallback>{item.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            <Link href={`/admin/users?q=${item.user.email}`} className="font-semibold hover:underline">{item.user.name}</Link>
            {' '}booked{' '}
            <Link href={`/admin/facilities/${item.facility.id}/edit`} className="font-semibold hover:underline">{item.facility.name}</Link>.
          </p>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <Ticket className="h-3 w-3" /> {timeAgo}
          </p>
        </div>
        <div className="text-sm font-semibold text-green-400 text-right">
          {currency ? `+${formatCurrency(item.bookingData.totalPrice, currency)}` : <Skeleton className="h-5 w-16" />}
        </div>
      </div>
    );
  }

  if (item.type === 'newUser') {
    return (
      <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
        <Avatar className="h-9 w-9 border">
          <AvatarImage src={item.user.profilePictureUrl} alt={item.user.name} />
          <AvatarFallback>{item.user.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            New user{' '}
            <Link href={`/admin/users?q=${item.user.email}`} className="font-semibold hover:underline">{item.user.name}</Link>
            {' '}joined the platform.
          </p>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <UserPlus className="h-3 w-3" /> {timeAgo}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default function AdminDashboardPage() {
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    // Keep loading state true only on initial fetch
    if (facilities.length === 0) setIsLoading(true);

    const [facilitiesData, usersData, bookingsData, settingsData] = await Promise.all([
        getFacilitiesAction(),
        getUsersAction(),
        getAllBookingsAction(),
        getSiteSettingsAction()
    ]);
    setFacilities(facilitiesData);
    setUsers(usersData);
    setBookings(bookingsData);
    setCurrency(settingsData.defaultCurrency);
    setIsLoading(false);
  }
    
  useEffect(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 10000); // Refresh every 10 seconds

    window.addEventListener('dataChanged', fetchData); // Also listen for manual triggers
    
    return () => {
        clearInterval(intervalId);
        window.removeEventListener('dataChanged', fetchData);
    };
  }, []);

  const { totalFacilities, activeUsers, totalBookings, totalRevenue, monthlyRevenueData, popularSportsData, activityFeed, liveOccupancy } = useMemo(() => {
    const now = new Date();
    
    const totalFacilities = facilities.length;
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const totalBookings = bookings.filter(b => b.status === 'Confirmed').length;
    const totalRevenue = bookings.filter(b => b.status === 'Confirmed').reduce((sum, b) => sum + b.totalPrice, 0);

    const last6Months: { month: string; year: number; monthKey: string }[] = [];
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        last6Months.push({ month: format(d, 'MMM'), year: getYear(d), monthKey: format(d, 'yyyy-MM') });
    }

    const aggregatedRevenue: Record<string, number> = {};
    bookings.forEach(booking => {
        if (booking.status === 'Confirmed') {
            const bookingDate = typeof booking.bookedAt === 'string' ? parseISO(booking.bookedAt) : booking.bookedAt;
            const monthKey = format(bookingDate, 'yyyy-MM');
            if (last6Months.some(m => m.monthKey === monthKey)) {
                aggregatedRevenue[monthKey] = (aggregatedRevenue[monthKey] || 0) + booking.totalPrice;
            }
        }
    });
    const monthlyRevenueData = last6Months.map(m => ({
        month: m.month,
        revenue: parseFloat((aggregatedRevenue[m.monthKey] || 0).toFixed(2)),
    }));
    
    const sportUsageMap = new Map<string, number>();
    bookings.forEach(booking => {
        if (booking.status === 'Confirmed') {
            sportUsageMap.set(booking.sportName, (sportUsageMap.get(booking.sportName) || 0) + 1);
        }
    });
    const popularSportsData = Array.from(sportUsageMap.entries())
        .map(([name, count]) => ({ sportName: name, bookings: count }))
        .sort((a,b) => b.bookings - a.bookings)
        .slice(0, 5);


    const bookingActivities: ActivityFeedItemType[] = bookings.map(b => ({
        type: 'booking',
        timestamp: b.bookedAt,
        user: users.find(u => u.id === b.userId),
        facility: facilities.find(f => f.id === b.facilityId),
        bookingData: b,
    }));
    const newUserActivities: ActivityFeedItemType[] = users.map(u => ({
        type: 'newUser',
        timestamp: u.joinedAt,
        user: u,
    }));
    const combinedFeed = [...bookingActivities, ...newUserActivities]
        .sort((a, b) => {
            const dateA = typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp;
            const dateB = typeof b.timestamp === 'string' ? new Date(b.timestamp) : b.timestamp;
            return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 10);
    
    const liveBookings = bookings.filter(b => {
        const bookingDate = parseISO(b.date);
        if (!isSameDay(now, bookingDate)) return false;
        
        const [startHour, startMinute] = b.startTime.split(':').map(Number);
        const [endHour, endMinute] = b.endTime.split(':').map(Number);
        const startTime = new Date(bookingDate).setHours(startHour, startMinute, 0, 0);
        const endTime = new Date(bookingDate).setHours(endHour, endMinute, 0, 0);

        return b.status === 'Confirmed' && isWithinInterval(now, { start: startTime, end: endTime });
    }).map(booking => ({...booking, user: users.find(u => u.id === booking.userId)}));


    return { totalFacilities, activeUsers, totalBookings, totalRevenue, monthlyRevenueData, popularSportsData, activityFeed: combinedFeed, liveOccupancy: liveBookings };
  }, [facilities, users, bookings]);


  if (isLoading) {
    return (
        <div className="space-y-8">
            <PageTitle title="Admin Dashboard" description="Overview of Sports Arena activities and performance." />
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle><DollarSign className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><Skeleton className="h-8 w-28" /></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Bookings</CardTitle><Ticket className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Users</CardTitle><Users className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Listed Facilities</CardTitle><Building2 className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
             </div>
             <div className="grid lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-2 h-[400px] w-full" />
                <Skeleton className="h-[400px] w-full" />
             </div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title="Admin Dashboard" description="Overview of Sports Arena activities and performance." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currency ? formatCurrency(totalRevenue, currency) : <Skeleton className="h-8 w-28" />}
            </div>
            <p className="text-xs text-muted-foreground">Based on all confirmed bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">All confirmed bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Platform-wide</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listed Facilities</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFacilities}</div>
            <p className="text-xs text-muted-foreground">Managed & active</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5 text-primary" /> Live Occupancy Status</CardTitle>
            <CardDescription>Facilities currently in use right now.</CardDescription>
          </CardHeader>
          <CardContent>
             {liveOccupancy.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                    <p>No facilities are currently occupied.</p>
                </div>
             ) : (
                <div className="space-y-4">
                    {liveOccupancy.map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                                <p className="font-semibold">{booking.facilityName} - <span className="font-normal text-muted-foreground">{booking.sportName}</span></p>
                                <p className="text-sm text-muted-foreground">Booked by: {booking.user?.name || "Unknown User"}</p>
                            </div>
                            <div className="text-right">
                                <Badge variant="default" className="bg-green-500 hover:bg-green-600 animate-pulse">LIVE</Badge>
                                <p className="text-xs text-muted-foreground mt-1">{booking.startTime} - {booking.endTime}</p>
                            </div>
                        </div>
                    ))}
                </div>
             )}
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest platform activities.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <div className="space-y-1 p-4 max-h-[350px] overflow-y-auto">
                  {activityFeed.length > 0 ? (
                      activityFeed.map((item, index) => <ActivityItem key={index} item={item} currency={currency} />)
                  ) : (
                      <p className="text-sm text-center text-muted-foreground py-8">
                          No recent activity to display.
                      </p>
                  )}
              </div>
            </CardContent>
        </Card>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <AnalyticsChart
              title="Monthly Revenue"
              description="Revenue from last 6 months."
              data={monthlyRevenueData}
              chartConfig={revenueChartConfig}
              type="line"
              dataKey="revenue"
              categoryKey="month"
            />
        </div>
        <div className="space-y-6">
            <AnalyticsChart
                title="Popular Sports"
                description="Top 5 sports by booking count."
                data={popularSportsData}
                chartConfig={popularSportsChartConfig}
                type="bar"
                dataKey="bookings"
                categoryKey="sportName"
            />
        </div>
      </div>
    </div>
  );
}

