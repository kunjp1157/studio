
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Booking, Facility } from '@/lib/types'; // Added Facility type
import { mockUser, getBookingsByUserId, getFacilityById } from '@/lib/data'; // Added getFacilityById
import { CalendarDays, Clock, DollarSign, Eye, Edit3, XCircle, MapPin, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isPast } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching user's bookings
    setTimeout(() => {
      const userBookings = getBookingsByUserId(mockUser.id);
      // Sort bookings: upcoming first, then past, both sorted by date
      userBookings.sort((a, b) => {
        const aDate = parseISO(a.date + 'T' + a.startTime);
        const bDate = parseISO(b.date + 'T' + b.startTime);
        const aIsPast = isPast(aDate);
        const bIsPast = isPast(bDate);

        if (aIsPast && !bIsPast) return 1; // a is past, b is upcoming, b comes first
        if (!aIsPast && bIsPast) return -1; // a is upcoming, b is past, a comes first
        
        // Both are upcoming or both are past, sort by date
        if (aIsPast) { // if both past, sort descending (most recent past first)
            return bDate.getTime() - aDate.getTime();
        } else { // if both upcoming, sort ascending (soonest upcoming first)
            return aDate.getTime() - bDate.getTime();
        }
      });
      setBookings(userBookings);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCancelBooking = (bookingId: string) => {
    // Mock cancellation
    setIsLoading(true);
    setTimeout(() => {
      setBookings(prevBookings => 
        prevBookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b)
      );
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
      setIsLoading(false);
    }, 1000);
  };
  
  const upcomingBookings = bookings.filter(b => !isPast(parseISO(b.date + 'T' + b.startTime)) && b.status === 'Confirmed');
  const pastBookings = bookings.filter(b => isPast(parseISO(b.date + 'T' + b.startTime)) || b.status !== 'Confirmed');


  if (isLoading && bookings.length === 0) {
    return <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size={48} /></div>;
  }
  
  const BookingCard = ({ booking }: { booking: Booking }) => {
    const facilityDetails = getFacilityById(booking.facilityId);
    
    return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
        <CardHeader className="p-0 relative">
        <Image
            src={booking.facilityImage || `https://placehold.co/400x200.png?text=${encodeURIComponent(booking.facilityName)}`}
            alt={booking.facilityName}
            width={400}
            height={200}
            className="w-full h-36 object-cover"
            data-ai-hint={booking.dataAiHint || "sports facility booking"}
        />
        <Badge 
            variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Cancelled' ? 'destructive' : 'secondary'}
            className={`absolute top-2 right-2 ${booking.status === 'Confirmed' && !isPast(parseISO(booking.date + 'T' + booking.startTime)) ? 'bg-green-500 text-white' : ''}`}
        >
            {booking.status}
        </Badge>
        </CardHeader>
        <CardContent className="p-4">
        <CardTitle className="text-xl mb-1 truncate font-headline">{booking.facilityName}</CardTitle>
        <div className="text-sm text-muted-foreground mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-primary" />
            {facilityDetails?.location || 'Unknown Location'}
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-primary" /> {format(parseISO(booking.date), 'EEE, MMM d, yyyy')}</div>
            <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-primary" /> {booking.startTime} - {booking.endTime}</div>
            <div className="flex items-center"><DollarSign className="w-4 h-4 mr-2 text-primary" /> Total: ${booking.totalPrice.toFixed(2)}</div>
        </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 space-x-2">
        <Link href={`/facilities/${booking.facilityId}`}>
            <Button variant="outline" size="sm"><Eye className="mr-1 h-4 w-4" /> View Facility</Button>
        </Link>
        {booking.status === 'Confirmed' && !isPast(parseISO(booking.date + 'T' + booking.startTime)) && (
            <>
            <Button variant="outline" size="sm" onClick={() => toast({title: "Feature Coming Soon", description: "Booking modification will be available soon."})}>
                <Edit3 className="mr-1 h-4 w-4" /> Modify
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isLoading}><XCircle className="mr-1 h-4 w-4" /> Cancel</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. Cancelling this booking might be subject to a cancellation fee according to our policy.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleCancelBooking(booking.id)} disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size={16} /> : 'Yes, Cancel Booking'}
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </>
        )}
        </CardFooter>
    </Card>
  )};

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="My Bookings" description="Manage your upcoming and past sports facility reservations." />

      {bookings.length === 0 && !isLoading ? (
        <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Bookings Yet!</AlertTitle>
            <AlertDescription>
            You haven't made any bookings. Start exploring facilities and reserve your spot!
            <Link href="/facilities">
                <Button className="mt-4">Browse Facilities</Button>
            </Link>
            </AlertDescription>
        </Alert>
      ) : (
        <>
            {upcomingBookings.length > 0 && (
                <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 font-headline">Upcoming Bookings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                </div>
                </section>
            )}

            {pastBookings.length > 0 && (
                 <section>
                 <h2 className="text-2xl font-semibold mb-6 font-headline">Past & Cancelled Bookings</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {pastBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                 </div>
                 </section>
            )}
             {upcomingBookings.length === 0 && pastBookings.length === 0 && !isLoading && (
                 <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>All Clear!</AlertTitle>
                    <AlertDescription>
                    You have no upcoming or past bookings to display at the moment.
                    <Link href="/facilities">
                        <Button className="mt-4">Explore Facilities</Button>
                    </Link>
                    </AlertDescription>
                </Alert>
            )}
        </>
      )}
    </div>
  );
}
