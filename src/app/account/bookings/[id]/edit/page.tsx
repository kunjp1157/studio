
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Booking, Facility, TimeSlot, SiteSettings } from '@/lib/types';
import { getBookingById, getFacilityById, calculateDynamicPrice, updateBooking, addNotification, mockUser } from '@/lib/data';
import { getSiteSettingsAction } from '@/app/actions';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, CalendarDays, Clock, DollarSign, Edit3, ArrowRight, Save } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, differenceInHours, parse } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const getMockTimeSlots = (
  date: Date,
  temporarilyBooked: Array<{ date: string; startTime: string }>
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 22;
  const dayOfWeek = date.getDay(); 
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const formattedDate = format(date, 'yyyy-MM-dd');

  for (let i = startHour; i < endHour; i++) {
    const startTime = `${String(i).padStart(2, '0')}:00`;
    const endTime = `${String(i + 1).padStart(2, '0')}:00`;
    const isPeakHour = i >= 18 && i <= 20;

    const isTemporarilyBooked = temporarilyBooked.some(
      (bookedSlot) => bookedSlot.date === formattedDate && bookedSlot.startTime === startTime
    );

    let availabilityScore = 1.0; 
    if (isWeekend) availabilityScore -= 0.25;
    if (isPeakHour) availabilityScore -= 0.35;
    if (isWeekend && isPeakHour) availabilityScore -= 0.15;
    
    const randomThreshold = Math.max(0.1, Math.min(0.9, availabilityScore));
    const isAvailable = !isTemporarilyBooked && Math.random() < randomThreshold;

    slots.push({ startTime, endTime, isAvailable });
  }
  return slots;
};

export default function EditBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [facility, setFacility] = useState<Facility | null | undefined>(undefined);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>(undefined);
  
  const [newTotalPrice, setNewTotalPrice] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (bookingId) {
        const [foundBooking, settings] = await Promise.all([
          Promise.resolve(getBookingById(bookingId)),
          getSiteSettingsAction(),
        ]);
        
        if (foundBooking) {
          const foundFacility = getFacilityById(foundBooking.facilityId);
          setBooking(foundBooking);
          setFacility(foundFacility);
          setSelectedDate(parseISO(foundBooking.date));
        } else {
          setBooking(null);
          setFacility(null);
        }
        setCurrency(settings.defaultCurrency);
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [bookingId]);

  useEffect(() => {
    if (selectedDate && facility) {
      const existingBookingsForFacility = facility.reviews?.map(r => getBookingById(r.bookingId || '')) || [];
      const temporarilyBooked = existingBookingsForFacility.filter(Boolean).map(b => ({date: b!.date, startTime: b!.startTime}));
      setTimeSlots(getMockTimeSlots(selectedDate, temporarilyBooked));
      setSelectedSlot(undefined);
    }
  }, [selectedDate, facility]);
  
  const bookingDurationHours = useMemo(() => {
    if (selectedSlot && selectedDate) {
      const slotStartDate = parse(selectedSlot.startTime, 'HH:mm', selectedDate);
      const slotEndDate = parse(selectedSlot.endTime, 'HH:mm', selectedDate);
      return differenceInHours(slotEndDate, slotStartDate) || 1;
    }
    return booking?.durationHours || 1;
  }, [selectedSlot, selectedDate, booking]);

  useEffect(() => {
    if (facility && selectedDate && selectedSlot) {
      const sportPriceInfo = facility.sportPrices.find(p => p.sportId === booking!.sportId);
      if (!sportPriceInfo) return;
      
      const { finalPrice } = calculateDynamicPrice(
        sportPriceInfo.pricePerHour,
        selectedDate,
        selectedSlot,
        bookingDurationHours
      );
      setNewTotalPrice(finalPrice);
    } else {
      setNewTotalPrice(null);
    }
  }, [facility, selectedDate, selectedSlot, bookingDurationHours, booking]);

  const handleSubmit = async () => {
    if (!booking || !facility || !selectedDate || !selectedSlot || newTotalPrice === null) {
      toast({ title: "Incomplete Selection", description: "Please select a new date and time.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateBooking(booking.id, {
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      totalPrice: newTotalPrice,
    });
    
    addNotification(mockUser.id, {
        type: 'general',
        title: 'Booking Modified',
        message: `Your booking for ${facility.name} has been successfully updated.`,
        link: '/account/bookings',
        iconName: 'Edit3',
    });

    toast({
      title: "Booking Updated!",
      description: `Your reservation at ${facility.name} has been changed.`,
    });
    
    router.push('/account/bookings');
  };

  const priceDifference = newTotalPrice !== null && booking ? newTotalPrice - booking.totalPrice : 0;

  const renderPrice = (price: number) => {
    if (!currency) return <Skeleton className="h-5 w-20 inline-block" />;
    return formatCurrency(price, currency);
  };

  if (isLoading) {
    return <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size={48} /></div>;
  }

  if (!booking || !facility) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Booking Not Found</AlertTitle>
          <AlertDescription>The booking you are trying to modify could not be found or you do not have permission to edit it.</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/account/bookings')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title={`Modify Booking: ${facility.name}`} description="Select a new date and time for your reservation." />
      
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Sport:</strong> {booking.sportName}</p>
              <p><strong>Date:</strong> {format(parseISO(booking.date), 'EEEE, MMM d, yyyy')}</p>
              <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
              <p><strong>Original Price:</strong> {renderPrice(booking.totalPrice)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>New Selection</CardTitle>
              <CardDescription>Choose a new date and an available time slot.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mt-1"
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} 
                />
              </div>
              <div className="space-y-4">
                <Label>Time Slot</Label>
                <Select onValueChange={(value) => setSelectedSlot(timeSlots.find(s => s.startTime === value))} value={selectedSlot?.startTime}>
                  <SelectTrigger><SelectValue placeholder="Select a new time" /></SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot.startTime} value={slot.startTime} disabled={!slot.isAvailable || (selectedDate && format(selectedDate, 'yyyy-MM-dd') === booking.date && slot.startTime === booking.startTime)}>
                        {slot.startTime} - {slot.endTime}
                        {!slot.isAvailable && " (Booked)"}
                        {(selectedDate && format(selectedDate, 'yyyy-MM-dd') === booking.date && slot.startTime === booking.startTime) && " (Current)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                { !selectedSlot && <p className="text-muted-foreground text-sm">Please select a new date and time to see the price difference.</p> }
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Modification Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Original Price:</span>
                <span>{renderPrice(booking.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>New Price:</span>
                <span>{newTotalPrice !== null ? renderPrice(newTotalPrice) : 'N/A'}</span>
              </div>
              <hr/>
              <div className="flex justify-between font-semibold text-lg">
                <span>Difference:</span>
                <span className={priceDifference > 0 ? 'text-orange-600' : priceDifference < 0 ? 'text-green-600' : ''}>
                  {newTotalPrice !== null ? renderPrice(priceDifference) : 'N/A'}
                </span>
              </div>
              {priceDifference > 0 && 
                <Alert variant="default"><AlertCircle className="h-4 w-4"/><AlertDescription>An additional payment will be required. (Mock: Not yet implemented)</AlertDescription></Alert>
              }
               {priceDifference < 0 && 
                <Alert variant="default" className="border-green-500/50"><AlertCircle className="h-4 w-4"/><AlertDescription>A partial refund will be processed. (Mock: Not yet implemented)</AlertDescription></Alert>
              }
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleSubmit}
                disabled={!selectedSlot || newTotalPrice === null || isSubmitting}
              >
                {isSubmitting ? <LoadingSpinner size={20} className="mr-2"/> : <Save className="mr-2 h-4 w-4" />}
                {isSubmitting ? 'Confirming...' : 'Confirm Changes'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
