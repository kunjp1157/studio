
'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Building, Ticket, DollarSign, Users, Construction } from 'lucide-react';
import type { SiteSettings, Booking, Facility, UserProfile } from '@/lib/types';
import { getSiteSettingsAction, getFacilitiesByOwnerIdAction, getAllBookingsAction } from '@/app/actions';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getMonth, getYear, parseISO, isAfter, format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserById } from '@/lib/data';


export default function OwnerDashboardPage() {
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
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


  useEffect(() => {
    const fetchData = async () => {
        if (!currentUser) return;
        
        setIsLoading(true);
        try {
            const [settings, ownerFacilities, allBookings] = await Promise.all([
                getSiteSettingsAction(),
                getFacilitiesByOwnerIdAction(currentUser.id),
                getAllBookingsAction()
            ]);
            
            setCurrency(settings.defaultCurrency);
            setFacilities(ownerFacilities);

            const facilityIds = ownerFacilities.map(f => f.id);
            const ownerBookings = allBookings.filter(b => facilityIds.includes(b.facilityId));
            setBookings(ownerBookings);

        } catch (error) {
            console.error("Error fetching owner dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
    
    window.addEventListener('dataChanged', fetchData);
    return () => window.removeEventListener('dataChanged', fetchData);
  }, [currentUser]);


  const ownerStats = bookings.reduce((acc, booking) => {
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
  }, {
      totalBookingsThisMonth: 0,
      monthlyRevenue: 0,
      totalBookings: 0,
  });
  
  const upcomingBookings = bookings
    .filter(b => b.status === 'Confirmed' && isAfter(parseISO(b.date), new Date()))
    .sort((a,b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 5);

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

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>
            Here are the next 5 upcoming confirmed bookings for your facilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Facility</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                      Array.from({length: 3}).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                          <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                          <TableCell><Skeleton className="h-5 w-40"/></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-5 w-16"/></TableCell>
                        </TableRow>
                      ))
                    ) : upcomingBookings.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                No upcoming bookings found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        upcomingBookings.map(booking => {
                            const user = getUserById(booking.userId);
                            return (
                                <TableRow key={booking.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8 hidden sm:flex">
                                                <AvatarImage src={user?.profilePictureUrl} />
                                                <AvatarFallback>{user?.name.charAt(0) || 'U'}</AvatarFallback>
                                            </Avatar>
                                            <span>{user?.name || 'Unknown User'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{booking.facilityName}</TableCell>
                                    <TableCell>{format(parseISO(booking.date), 'MMM d, yyyy')} at {booking.startTime}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        {currency ? formatCurrency(booking.totalPrice, currency) : '...'}
                                    </TableCell>
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
  );
}
