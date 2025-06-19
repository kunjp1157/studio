
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Facility, TimeSlot } from '@/lib/types';
import { getFacilityById, mockUser, addNotification } from '@/lib/data';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, CreditCard, CalendarDays, Clock, Users, DollarSign, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Mock time slots for a given date
const getMockTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 22;
  for (let i = startHour; i < endHour; i++) {
    slots.push({
      startTime: `${String(i).padStart(2, '0')}:00`,
      endTime: `${String(i + 1).padStart(2, '0')}:00`,
      isAvailable: Math.random() > 0.3, // Random availability
    });
  }
  return slots;
};


export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const facilityId = params.id as string;

  const [facility, setFacility] = useState<Facility | null | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>(undefined);
  const [numberOfGuests, setNumberOfGuests] = useState<string>("1");
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (facilityId) {
      const foundFacility = getFacilityById(facilityId);
      setTimeout(() => setFacility(foundFacility || null), 300); // Simulate fetch
    }
  }, [facilityId]);

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(getMockTimeSlots(selectedDate));
      setSelectedSlot(undefined); // Reset selected slot when date changes
    }
  }, [selectedDate]);

  const handleDateSelect = (date?: Date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slotValue: string) => {
    const slot = timeSlots.find(s => s.startTime === slotValue);
    if (slot && slot.isAvailable) {
      setSelectedSlot(slot);
    }
  };
  
  const calculatedPrice = facility && selectedSlot ? facility.pricePerHour * (parseInt(numberOfGuests) || 1) : 0;


  const proceedToPayment = () => {
    if (!selectedDate || !selectedSlot || !facility) {
      toast({
        title: "Missing Information",
        description: "Please select a date, time slot, and ensure facility details are loaded.",
        variant: "destructive",
      });
      return;
    }
    if (facility.capacity && parseInt(numberOfGuests) > facility.capacity) {
        toast({
            title: "Guest Limit Exceeded",
            description: `This facility has a maximum capacity of ${facility.capacity} guests.`,
            variant: "destructive",
        });
        return;
    }
    setBookingStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setBookingStep('confirmation');
    const bookingDate = selectedDate ? format(selectedDate, 'PPP') : 'N/A';
    const bookingTime = selectedSlot?.startTime || 'N/A';
    
    toast({
      title: "Booking Confirmed!",
      description: `Your booking for ${facility?.name} on ${bookingDate} at ${bookingTime} for ${numberOfGuests} guest(s) is confirmed.`,
      className: "bg-green-500 text-white",
    });

    // Simulate adding an in-app notification
    if (facility) {
        addNotification(mockUser.id, {
            type: 'booking_confirmed',
            title: 'Booking Confirmed!',
            message: `Your booking for ${facility.name} (${numberOfGuests} guest(s)) on ${bookingDate} at ${bookingTime} is successful.`,
            link: '/account/bookings',
        });
    }
    // In a real app, you would also trigger backend to send email/SMS here.
  };


  if (facility === undefined) {
    return <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size={48} /></div>;
  }

  if (!facility) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Facility Not Found</AlertTitle>
          <AlertDescription>The facility you are trying to book does not exist.</AlertDescription>
        </Alert>
         <Button variant="outline" className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Facility
      </Button>
      <PageTitle title={`Book ${facility.name}`} description="Select your preferred date, time, and complete your booking." />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {bookingStep === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle>Select Date and Time</CardTitle>
                <CardDescription>Choose an available slot for your activity.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="booking-date" className="mb-2 block"><CalendarDays className="inline mr-2 h-4 w-4" />Date</Label>
                  <Calendar
                    id="booking-date"
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                  />
                </div>
                <div>
                  <Label htmlFor="time-slot" className="mb-2 block"><Clock className="inline mr-2 h-4 w-4" />Time Slot</Label>
                  {selectedDate && timeSlots.length > 0 ? (
                    <Select onValueChange={handleSlotSelect} value={selectedSlot?.startTime}>
                      <SelectTrigger id="time-slot">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(slot => (
                          <SelectItem key={slot.startTime} value={slot.startTime} disabled={!slot.isAvailable}>
                            {slot.startTime} - {slot.endTime} {!slot.isAvailable && "(Booked)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-muted-foreground">Please select a date to see available time slots.</p>
                  )}
                  {facility.capacity && (
                    <div className="mt-4">
                        <Label htmlFor="guests" className="mb-2 block"><Users className="inline mr-2 h-4 w-4" />Number of Guests/Participants</Label>
                        <Input 
                            id="guests" 
                            type="number" 
                            min="1" 
                            max={facility.capacity} 
                            value={numberOfGuests}
                            onChange={(e) => setNumberOfGuests(e.target.value)}
                            placeholder={`Max ${facility.capacity}`} 
                        />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {bookingStep === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Enter your payment information to complete the booking.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input id="card-name" type="text" placeholder="John Doe" required />
                  </div>
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" type="text" placeholder="•••• •••• •••• ••••" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input id="expiry-date" type="text" placeholder="MM/YY" required />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" type="text" placeholder="•••" required />
                    </div>
                  </div>
                   <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size={20} className="mr-2"/> : <CreditCard className="mr-2 h-5 w-5" />}
                    {isLoading ? 'Processing...' : `Pay $${calculatedPrice.toFixed(2)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {bookingStep === 'confirmation' && (
            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Thank you, {mockUser.name}!</p>
                <p className="mb-1">Your booking for <strong>{facility.name}</strong> is confirmed.</p>
                <p className="mb-1">Date: <strong>{selectedDate ? format(selectedDate, 'PPP') : 'N/A'}</strong></p>
                <p className="mb-1">Time: <strong>{selectedSlot?.startTime} - {selectedSlot?.endTime}</strong></p>
                <p className="mb-4">Number of Guests: <strong>{numberOfGuests}</strong></p>
                <p className="text-lg font-semibold">Total Paid: ${calculatedPrice.toFixed(2)}</p>
                <Alert className="mt-4 text-left">
                  <AlertCircle className="h-4 w-4"/>
                  <AlertTitle>What's Next?</AlertTitle>
                  <AlertDescription>
                    You will receive an email confirmation shortly with all your booking details. 
                    You can also view your booking in the "My Bookings" section of your account.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                 <Button onClick={() => router.push('/account/bookings')} className="w-full">View My Bookings</Button>
                 <Button variant="outline" onClick={() => router.push('/facilities')} className="w-full">Book Another Facility</Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Booking Summary Card */}
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Facility:</span>
                <span className="font-medium">{facility.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{selectedDate ? format(selectedDate, 'PPP') : 'Not Selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : 'Not Selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests:</span>
                <span className="font-medium">{numberOfGuests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per Guest/Hour:</span>
                <span className="font-medium">${facility.pricePerHour.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${calculatedPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            {bookingStep === 'details' && (
              <CardFooter>
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={proceedToPayment} 
                  disabled={!selectedDate || !selectedSlot || !numberOfGuests || parseInt(numberOfGuests) < 1}
                >
                  Proceed to Payment
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
