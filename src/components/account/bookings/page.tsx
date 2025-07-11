
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Booking, Facility, Review, SiteSettings } from '@/lib/types';
import { mockUser, getFacilityById, addReview as addMockReview, addNotification, updateBooking, listenToUserBookings, getSiteSettings } from '@/lib/data';
import { CalendarDays, Clock, DollarSign, Eye, Edit3, XCircle, MapPin, AlertCircle, MessageSquarePlus } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';


const BookingCardSkeleton = () => (
    <Card className="overflow-hidden shadow-lg">
        <Skeleton className="h-36 w-full" />
        <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 space-x-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
        </CardFooter>
    </Card>
);


export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const { toast } = useToast();
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const [facilities, setFacilities] = useState<Record<string, Facility>>({});

  useEffect(() => {
      const settings = getSiteSettings();
      setCurrency(settings.defaultCurrency);

      const unsubscribe = listenToUserBookings(
          mockUser.id, 
          (userBookings) => {
              userBookings.sort((a, b) => {
                const aDate = parseISO(a.date + 'T' + a.startTime);
                const bDate = parseISO(b.date + 'T' + b.startTime);
                const aIsPast = isPast(aDate);
                const bIsPast = isPast(bDate);

                if (aIsPast && !bIsPast) return 1;
                if (!aIsPast && bIsPast) return -1;
                
                if (aIsPast) {
                    return bDate.getTime() - aDate.getTime();
                } else {
                    return aDate.getTime() - bDate.getTime();
                }
              });
              setBookings(userBookings);
              setIsLoading(false);
          },
          (error) => {
              console.error("Failed to listen to user bookings:", error);
              toast({ title: "Error", description: "Could not load real-time bookings.", variant: "destructive" });
              setIsLoading(false);
          }
      );

      return () => unsubscribe();
  }, [toast]);

  useEffect(() => {
    const fetchRelatedFacilities = async () => {
        if (bookings.length > 0) {
            const facilityIds = [...new Set(bookings.map(b => b.facilityId))];
            const facilityPromises = facilityIds.map(async id => {
                if (facilities[id]) return null;
                const facility = await getFacilityById(id);
                return {id, data: facility};
            });
            const facilitiesData = (await Promise.all(facilityPromises)).filter(Boolean);

            if(facilitiesData.length > 0) {
              setFacilities(prev => facilitiesData.reduce((acc, {id, data}) => {
                  if (data) acc[id] = data;
                  return acc;
              }, {...prev}));
            }
        }
    };
    fetchRelatedFacilities();
  }, [bookings, facilities]);

  const handleCancelBooking = async (bookingId: string) => {
    setIsActionLoading(true);
    const bookingToCancel = bookings.find(b => b.id === bookingId);

    try {
        await updateBooking(bookingId, { status: 'Cancelled' });
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been successfully cancelled.",
        });
        
        if (bookingToCancel) {
          addNotification(mockUser.id, {
              type: 'booking_cancelled',
              title: 'Booking Cancelled',
              message: `Your booking for ${bookingToCancel.facilityName} on ${format(parseISO(bookingToCancel.date), 'MMM d, yyyy')} has been cancelled.`,
              link: '/account/bookings',
          });
        }
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to cancel the booking. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsActionLoading(false);
    }
  };

  const handleOpenReviewModal = (booking: Booking) => {
    setSelectedBookingForReview(booking);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (rating: number, comment: string, bookingId: string) => {
    if (!selectedBookingForReview) return;

    try {
      await addMockReview({
        facilityId: selectedBookingForReview.facilityId,
        userId: mockUser.id,
        rating,
        comment,
        bookingId,
      });

      toast({
        title: "Review Submitted!",
        description: `Thank you for reviewing ${selectedBookingForReview.facilityName}.`,
        className: "bg-green-500 text-white",
      });
      
      addNotification(mockUser.id, {
        type: 'review_submitted',
        title: 'Review Submitted!',
        message: `Your review for ${selectedBookingForReview.facilityName} has been posted.`,
        link: `/facilities/${selectedBookingForReview.facilityId}`,
      });

      setIsReviewModalOpen(false);
      setSelectedBookingForReview(null);
    } catch (error) {
      toast({
        title: "Error Submitting Review",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const upcomingBookings = bookings.filter(b => !isPast(parseISO(b.date + 'T' + b.startTime)) && b.status === 'Confirmed');
  const pastBookings = bookings.filter(b => isPast(parseISO(b.date + 'T' + b.startTime)) || b.status !== 'Confirmed');


  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <PageTitle title="My Bookings" description="Manage your upcoming and past sports facility reservations." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 3 }).map((_, index) => <BookingCardSkeleton key={index} />)}
        </div>
      </div>
    );
  }
  
  const BookingCard = ({ booking }: { booking: Booking }) => {
    const facilityDetails = facilities[booking.facilityId];
    const bookingIsPast = isPast(parseISO(booking.date + 'T' + booking.startTime));
    
    const renderPrice = (price: number) => {
        if (!currency) return <Skeleton className="h-5 w-20 inline-block" />;
        return formatCurrency(price, currency);
    };

    return (
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-lg hover:scale-[1.03]">
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
            className={`absolute top-2 right-2 ${booking.status === 'Confirmed' && !bookingIsPast ? 'bg-green-500 text-white' : ''}`}
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
            <div className="flex items-center"><DollarSign className="w-4 h-4 mr-2 text-primary" /> Total: {renderPrice(booking.totalPrice)}</div>
        </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 space-x-2 flex-wrap gap-y-2">
            <Link href={`/facilities/${booking.facilityId}`}>
                <Button variant="outline" size="sm"><Eye className="mr-1 h-4 w-4" /> View Facility</Button>
            </Link>
            {booking.status === 'Confirmed' && !bookingIsPast && (
                <>
                <Link href={`/account/bookings/${booking.id}/edit`}>
                    <Button variant="outline" size="sm">
                        <Edit3 className="mr-1 h-4 w-4" /> Modify
                    </Button>
                </Link>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isActionLoading}><XCircle className="mr-1 h-4 w-4" /> Cancel</Button>
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
                        <AlertDialogAction onClick={() => handleCancelBooking(booking.id)} disabled={isActionLoading}>
                        {isActionLoading ? <LoadingSpinner size={16} /> : 'Yes, Cancel Booking'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </>
            )}
            {booking.status === 'Confirmed' && bookingIsPast && !booking.reviewed && (
                <Button variant="secondary" size="sm" onClick={() => handleOpenReviewModal(booking)}>
                    <MessageSquarePlus className="mr-1 h-4 w-4" /> Write Review
                </Button>
            )}
            {booking.status === 'Confirmed' && bookingIsPast && booking.reviewed && (
                 <Badge variant="outline" className="text-green-600 border-green-600 py-1 px-2">Reviewed</Badge>
            )}
        </CardFooter>
    </Card>
  )};

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="My Bookings" description="Manage your upcoming and past sports facility reservations." />

      {selectedBookingForReview && (
        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Write a Review for {selectedBookingForReview.facilityName}</DialogTitle>
                    <DialogDescription>
                        Share your experience to help others. Your feedback is valuable!
                    </DialogDescription>
                </DialogHeader>
                <ReviewForm
                    facilityName={selectedBookingForReview.facilityName}
                    bookingId={selectedBookingForReview.id}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => {
                        setIsReviewModalOpen(false);
                        setSelectedBookingForReview(null);
                    }}
                />
            </DialogContent>
        </Dialog>
      )}

      {bookings.length === 0 && !isLoading ? (
        <Alert className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Bookings Yet!</AlertTitle>
            <AlertDescription>
            You haven't made any bookings. Start exploring facilities and reserve your spot!
            <Link href="/facilities" className="mt-4 inline-block">
                <Button>Browse Facilities</Button>
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
                    <Link href="/facilities" className="mt-4 inline-block">
                        <Button>Explore Facilities</Button>
                    </Link>
                    </AlertDescription>
                </Alert>
            )}
        </>
      )}
    </div>
  );
}
