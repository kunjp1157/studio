
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import {
  mockReportData,
  getUserById,
  getFacilityById,
} from '@/lib/data';
import { getFacilitiesAction, getUsersAction, getAllBookingsAction, getSiteSettingsAction } from '@/app/actions';
import { DollarSign, Users, TrendingUp, Ticket, Building2, Activity, UserPlus } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';
import { parseISO, getMonth, getYear, format, subMonths, formatDistanceToNow } from 'date-fns';
import type { Booking, UserProfile, Facility, SiteSettings } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const bookingsChartConfig = {
  bookings: { label: 'Bookings', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const revenueChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const facilityUsageChartConfig = {
  bookings: { label: 'Bookings', color: 'hsl(var(--chart-1))' },
  facilityName: { label: 'Facility' },
} satisfies ChartConfig;

// Define a unified activity item type
interface ActivityFeedItemType {
  type: 'booking' | 'newUser';
  timestamp: string; // ISO string
  user: UserProfile | undefined;
  bookingData?: Booking;
  facility?: Facility | undefined;
}

// A sub-component to render each item in the feed
const ActivityItem = ({ item }: { item: ActivityFeedItemType }) => {
  if (!item.user) return null;

  const timeAgo = formatDistanceToNow(parseISO(item.timestamp), { addSuffix: true });

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
        <div className="text-sm font-semibold text-green-600 dark:text-green-500 text-right">
          +${item.bookingData.totalPrice.toFixed(2)}
        </div>
      </div>
    );
  }

  if (item.type === 'newUser') {
    return (
      <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
        <Avatar className="h-9 w-9 border">
          <AvatarImage src={item.user.profilePictureUrl} alt={item.user.name} />
          <AvatarFallback>{item.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
  const [totalFacilities, setTotalFacilities] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalBookingsThisMonth, setTotalBookingsThisMonth] = useState(0);
  const [totalRevenueThisMonth, setTotalRevenueThisMonth] = useState(0);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  const [monthlyBookingsData, setMonthlyBookingsData] = useState<Array<{ month: string; bookings: number }>>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<Array<{ month: string; revenue: number }>>([]);
  const [facilityUsageData, setFacilityUsageData] = useState<Array<{ facilityName: string; bookings: number }>>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItemType[]>([]);
  
  useEffect(() => {
    const fetchAndSetData = async () => {
      const [currentSettings, facilities, users, bookings] = await Promise.all([
        getSiteSettingsAction(),
        getFacilitiesAction(),
        getUsersAction(),
        getAllBookingsAction(),
      ]);

      setCurrency(currentSettings.defaultCurrency);
      
      setTotalFacilities(facilities.length);
      setActiveUsers(users.filter(u => u.status === 'Active').length);

      const now = new Date();
      const currentMonth = getMonth(now);
      const currentYr = getYear(now);

      const bookingsThisMonth = bookings.filter(b => {
        const bookingDate = parseISO(b.bookedAt);
        return getMonth(bookingDate) === currentMonth && getYear(bookingDate) === currentYr && b.status === 'Confirmed';
      });
      setTotalBookingsThisMonth(bookingsThisMonth.length);
      setTotalRevenueThisMonth(bookingsThisMonth.reduce((sum, b) => sum + b.totalPrice, 0));

      const last6Months: { month: string; year: number; monthKey: string }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        last6Months.push({ month: format(d, 'MMM'), year: getYear(d), monthKey: format(d, 'yyyy-MM') });
      }

      const aggregatedBookings: Record<string, number> = {};
      const aggregatedRevenue: Record<string, number> = {};

      bookings.forEach(booking => {
        if (booking.status === 'Confirmed') {
          const bookingDate = parseISO(booking.bookedAt);
          const monthKey = format(bookingDate, 'yyyy-MM');
          if (last6Months.some(m => m.monthKey === monthKey)) {
            aggregatedBookings[monthKey] = (aggregatedBookings[monthKey] || 0) + 1;
            aggregatedRevenue[monthKey] = (aggregatedRevenue[monthKey] || 0) + booking.totalPrice;
          }
        }
      });

      setMonthlyBookingsData(last6Months.map(m => ({
        month: m.month,
        bookings: aggregatedBookings[m.monthKey] || 0,
      })));
      setMonthlyRevenueData(last6Months.map(m => ({
        month: m.month,
        revenue: parseFloat((aggregatedRevenue[m.monthKey] || 0).toFixed(2)),
      })));

      setFacilityUsageData(mockReportData.facilityUsage);
      
      const bookingActivities: ActivityFeedItemType[] = bookings.map(b => ({
        type: 'booking',
        timestamp: b.bookedAt,
        user: getUserById(b.userId),
        facility: getFacilityById(b.facilityId),
        bookingData: b,
      }));

      const newUserActivities: ActivityFeedItemType[] = users.map(u => ({
        type: 'newUser',
        timestamp: u.joinedAt,
        user: u,
      }));

      const combinedFeed = [...bookingActivities, ...newUserActivities];
      combinedFeed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivityFeed(combinedFeed.slice(0, 7)); // Show latest 7 activities
    };
    
    fetchAndSetData();
    const intervalId = setInterval(fetchAndSetData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-8">
      <PageTitle title="Admin Dashboard" description="Overview of Sports Arena activities and performance." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (This Month)</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currency ? formatCurrency(totalRevenueThisMonth, currency) : <Skeleton className="h-8 w-28" />}
            </div>
            <p className="text-xs text-muted-foreground">+15.2% from last month (mock)</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings (This Month)</CardTitle>
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookingsThisMonth ? totalBookingsThisMonth.toLocaleString() : <Skeleton className="h-8 w-16" />}</div>
            <p className="text-xs text-muted-foreground">+8.1% from last month (mock)</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers ? activeUsers : <Skeleton className="h-8 w-16" />}</div>
            <p className="text-xs text-muted-foreground">Platform-wide</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listed Facilities</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFacilities ? totalFacilities : <Skeleton className="h-8 w-16" />}</div>
            <p className="text-xs text-muted-foreground">Managed & active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <AnalyticsChart
          title="Monthly Bookings (Last 6 Months)"
          description="Total confirmed bookings per month."
          data={monthlyBookingsData}
          chartConfig={bookingsChartConfig}
          type="bar"
          dataKey="bookings"
          categoryKey="month"
        />
        <AnalyticsChart
          title="Monthly Revenue (Last 6 Months)"
          description="Total confirmed revenue per month."
          data={monthlyRevenueData}
          chartConfig={revenueChartConfig}
          type="line"
          dataKey="revenue"
          categoryKey="month"
        />
      </div>
       <div className="grid gap-6 lg:grid-cols-2">
         <AnalyticsChart
            title="Facility Usage (All Time Bookings)"
            description="Total bookings per facility."
            data={facilityUsageData}
            chartConfig={facilityUsageChartConfig}
            type="pie"
            categoryKey="facilityName" 
            valueKey="bookings"   
         />
         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-6 w-6 text-primary" />
                    Recent Activity
                </CardTitle>
                <CardDescription>
                  A feed of recent platform activities like new bookings and user registrations.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <div className="space-y-1 p-4 max-h-[300px] overflow-y-auto">
                  {activityFeed.length > 0 ? (
                      activityFeed.map((item, index) => <ActivityItem key={index} item={item} />)
                  ) : (
                      <p className="text-sm text-center text-muted-foreground py-8">
                          No recent activity to display.
                      </p>
                  )}
              </div>
            </CardContent>
         </Card>
       </div>
    </div>
  );
}
    
