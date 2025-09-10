

'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Building, Ticket, DollarSign, Users, Construction } from 'lucide-react';
import type { SiteSettings, Booking, Facility, UserProfile } from '@/lib/types';
import { getSiteSettingsAction, getFacilitiesByOwnerIdAction, getAllBookingsAction, getUsersAction } from '@/app/actions';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getMonth, getYear, parseISO, isAfter, format, subMonths } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import type { ChartConfig } from '@/components/ui/chart';


const facilityUsageChartConfig = {
  bookings: { label: 'Bookings', color: 'hsl(var(--chart-1))' },
  facilityName: { label: 'Facility' },
} satisfies ChartConfig;


export default function OwnerDashboardPage() {
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
        setCurrentUser(JSON.parse(activeUser));
    }
     const handleUserChange = () => {
        const updatedUser = sessionStorage.getItem('activeUser');
        if(updatedUser) {
            setCurrentUser(JSON.parse(updatedUser));
        }
    };
    window.addEventListener('userChanged', handleUserChange);
    return () => window.removeEventListener('userChanged', handleUserChange);
  }, []);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
        const [settings, ownerFacilities, allBookings, allUsers] = await Promise.all([
            getSiteSettingsAction(),
            getFacilitiesByOwnerIdAction(currentUser.id),
            getAllBookingsAction(),
            getUsersAction()
        ]);
        
        setCurrency(settings.defaultCurrency);
        setFacilities(ownerFacilities);
        setUsers(allUsers);

        const facilityIds = ownerFacilities.map(f => f.id);
        const ownerBookings = allBookings.filter(b => facilityIds.includes(b.facilityId));
        setBookings(ownerBookings);

    } catch (error) {
        console.error("Error fetching owner dashboard data:", error);
    } finally {
        setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    
    fetchData();
    
    window.addEventListener('dataChanged', fetchData);
    return () => window.removeEventListener('dataChanged', fetchData);
  }, [currentUser, fetchData]);


  const { ownerStats, facilityUsageData, upcomingBookings } = useMemo(() => {
    const stats = bookings.reduce((acc, booking) => {
        const now = new Date();
        if (booking.status === 'Confirmed') {
            const bookingDate = parseISO(booking.bookedAt);
            acc.totalBookings += 1;
            if (getMonth(bookingDate) === getMonth(now) && getYear(bookingDate) === getYear(now)) {
                acc.totalBookingsThisMonth += 1;
                acc.monthlyRevenue += booking.totalPrice;
            }
        }
        return acc;
    }, { totalBookingsThisMonth: 0, monthlyRevenue: 0, totalBookings: 0 });

    const usageMap = new Map<string, number>();
    bookings.forEach(booking => {
        if (booking.status === 'Confirmed') {
            usageMap.set(booking.facilityName, (usageMap.get(booking.facilityName) || 0) + 1);
        }
    });
    const usageData = Array.from(usageMap.entries())
        .map(([name, count]) => ({ facilityName: name, bookings: count }))
        .sort((a,b) => b.bookings - a.bookings);

    const upcoming = bookings
        .filter(b => b.status === 'Confirmed' && isAfter(parseISO(b.date), new Date()))
        .sort((a,b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
        .slice(0, 5)
        .map(booking => {
            const user = users.find(u => u.id === booking.userId);
            return { ...booking, user };
        });


    return { ownerStats: stats, facilityUsageData: usageData, upcomingBookings: upcoming };
  }, [bookings, users]);

  return (
    <div className="space-y-8">
      <PageTitle title="Owner Dashboard" description="Overview of your facilities and performance." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Facilities</CardTitle>
            <Building className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : facilities.length}</div>
            <p className="text-xs text-muted-foreground">Total facilities managed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings (This Month)</CardTitle>
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : ownerStats.totalBookingsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Confirmed bookings this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (This Month)</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading || !currency ? <Skeleton className="h-8 w-28" /> : formatCurrency(ownerStats.monthlyRevenue, currency)}
            </div>
            <p className="text-xs text-muted-foreground">From confirmed bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : ownerStats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All-time confirmed bookings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
             <AnalyticsChart
                title="Facility Occupancy"
                description="Total confirmed bookings per facility."
                data={facilityUsageData}
                chartConfig={facilityUsageChartConfig}
                type="bar"
                dataKey="bookings"
                categoryKey="facilityName"
                className="h-[450px]"
            />
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>
                    Your next 5 confirmed bookings.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                            Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                                <TableCell><Skeleton className="h-5 w-20"/></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-5 w-16"/></TableCell>
                                </TableRow>
                            ))
                            ) : upcomingBookings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                        No upcoming bookings.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                upcomingBookings.map(booking => {
                                    return (
                                        <TableRow key={booking.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8 hidden sm:flex">
                                                        <AvatarImage src={booking.user?.profilePictureUrl} />
                                                        <AvatarFallback>{booking.user?.name.charAt(0) || 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium truncate">{booking.user?.name || 'Unknown'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{format(parseISO(booking.date), 'MMM d, yy')}</TableCell>
                                            <TableCell className="text-right">{booking.startTime}</TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
