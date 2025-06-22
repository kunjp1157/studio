
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Facility, TimeSlot, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, PricingRule, SiteSettings } from '@/lib/types';
import { getFacilityById, mockUser, addNotification, getPromotionRuleByCode, calculateDynamicPrice, mockPricingRules, getSiteSettings } from '@/lib/data';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { AlertCircle, CheckCircle, CreditCard, CalendarDays, Clock, Users, DollarSign, ArrowLeft, PackageSearch, Minus, Plus, ShoppingCart, Tag, X, TrendingUp, Link2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInHours, parse, formatISO, addHours } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

// Enhanced mock time slots for a given date
const getMockTimeSlots = (
  date: Date,
  temporarilyBooked: Array<{ date: string; startTime: string }>
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 22;
  const dayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const formattedDate = format(date, 'yyyy-MM-dd');

  for (let i = startHour; i < endHour; i++) {
    const startTime = `${String(i).padStart(2, '0')}:00`;
    const endTime = `${String(i + 1).padStart(2, '0')}:00`;
    const isPeakHour = i >= 18 && i <= 20; // 6 PM to 8 PM (slot starts at 8 PM ends at 9 PM)

    const isTemporarilyBooked = temporarilyBooked.some(
      (bookedSlot) => bookedSlot.date === formattedDate && bookedSlot.startTime === startTime
    );

    let availabilityScore = 1.0; // Start with fully available

    if (isWeekend) {
      availabilityScore -= 0.25; // Reduce availability by 25% on weekends
    }
    if (isPeakHour) {
      availabilityScore -= 0.35; // Reduce availability by 35% during peak hours
    }
    if (isWeekend && isPeakHour) {
      availabilityScore -= 0.15; // Additional reduction for weekend peak hours
    }

    // Ensure a minimum chance of being available, e.g., 10% unless temporarily booked
    const randomThreshold = Math.max(0.1, Math.min(0.9, availabilityScore));
    const isAvailable = !isTemporarilyBooked && Math.random() < randomThreshold;

    slots.push({
      startTime,
      endTime,
      isAvailable,
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
  
  const [selectedEquipment, setSelectedEquipment] = useState<Map<string, { quantity: number; details: RentalEquipment }>>(new Map());
  const [equipmentRentalCost, setEquipmentRentalCost] = useState(0);
  const [baseFacilityPrice, setBaseFacilityPrice] = useState(0);
  const [appliedPricingRuleMessage, setAppliedPricingRuleMessage] = useState<string | null>(null);
  
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromotionDetails, setAppliedPromotionDetails] = useState<AppliedPromotionInfo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const [totalBookingPrice, setTotalBookingPrice] = useState(0);
  
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [temporarilyBookedSlots, setTemporarilyBookedSlots] = useState<Array<{ date: string; startTime: string }>>([]);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency']>(getSiteSettings().defaultCurrency);

  // Effect for fetching facility data (runs when facilityId changes)
  useEffect(() => {
    if (facilityId) {
      const foundFacility = getFacilityById(facilityId);
      setTimeout(() => setFacility(foundFacility || null), 300); // Simulate fetch
    }
  }, [facilityId]);

  // Effect for polling currency (runs only once)
  useEffect(() => {
    const settingsInterval = setInterval(() => {
      const currentSettings = getSiteSettings();
      setCurrency(prev => currentSettings.defaultCurrency !== prev ? currentSettings.defaultCurrency : prev);
    }, 3000);
    return () => clearInterval(settingsInterval);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(getMockTimeSlots(selectedDate, temporarilyBookedSlots));
      setSelectedSlot(undefined); 
    }
  }, [selectedDate, temporarilyBookedSlots]);
  
  const bookingDurationHours = useMemo(() => {
    if (selectedSlot && selectedDate) {
      try {
        const slotStartDate = parse(selectedSlot.startTime, 'HH:mm', selectedDate);
        const slotEndDate = parse(selectedSlot.endTime, 'HH:mm', selectedDate);
        if (slotEndDate < slotStartDate) slotEndDate.setDate(slotEndDate.getDate() + 1); // Handle midnight crossover
        const diff = differenceInHours(slotEndDate, slotStartDate);
        return diff > 0 ? diff : 1; 
      } catch (error) {
        console.error("Error parsing slot times:", error);
        return 1; 
      }
    }
    return 1; 
  }, [selectedSlot, selectedDate]);


  useEffect(() => {
    if (facility && selectedDate && selectedSlot) {
      const { finalPrice, appliedRuleName, appliedRuleDetails } = calculateDynamicPrice(
        facility.pricePerHour,
        selectedDate,
        selectedSlot,
        bookingDurationHours
      );
      setBaseFacilityPrice(finalPrice);

      if (appliedRuleName && appliedRuleDetails) {
        let changeDescription = "";
        const originalHourlyRate = facility.pricePerHour;
        const newHourlyRate = finalPrice / bookingDurationHours;

        switch (appliedRuleDetails.adjustmentType) {
            case 'percentage_increase': changeDescription = `(+${appliedRuleDetails.value}%)`; break;
            case 'percentage_decrease': changeDescription = `(-${appliedRuleDetails.value}%)`; break;
            case 'fixed_increase': changeDescription = `(+${formatCurrency(appliedRuleDetails.value, currency)}/hr)`; break;
            case 'fixed_decrease': changeDescription = `(-${formatCurrency(appliedRuleDetails.value, currency)}/hr)`; break;
            case 'fixed_price': changeDescription = `(to ${formatCurrency(appliedRuleDetails.value, currency)}/hr)`; break;
        }
        if (newHourlyRate !== originalHourlyRate) {
             setAppliedPricingRuleMessage(`${appliedRuleName} ${changeDescription}`);
        } else {
            setAppliedPricingRuleMessage(null); 
        }
      } else {
        setAppliedPricingRuleMessage(null);
      }
    } else {
      setBaseFacilityPrice(facility ? facility.pricePerHour * bookingDurationHours : 0);
      setAppliedPricingRuleMessage(null);
    }
  }, [facility, selectedDate, selectedSlot, bookingDurationHours, currency]);

  useEffect(() => {
    let rentalCost = 0;
    selectedEquipment.forEach(item => {
      if (item.details.priceType === 'per_booking') {
        rentalCost += item.details.pricePerItem * item.quantity;
      } else if (item.details.priceType === 'per_hour') {
        rentalCost += item.details.pricePerItem * item.quantity * bookingDurationHours;
      }
    });
    setEquipmentRentalCost(rentalCost);
  }, [selectedEquipment, bookingDurationHours]);

  useEffect(() => {
    const subTotal = baseFacilityPrice + equipmentRentalCost;
    let finalPrice = subTotal;
    if (appliedPromotionDetails) {
      finalPrice = Math.max(0, subTotal - appliedPromotionDetails.discountAmount);
    }
    setTotalBookingPrice(finalPrice);
  }, [baseFacilityPrice, equipmentRentalCost, appliedPromotionDetails]);


  const handleEquipmentSelection = (equip: RentalEquipment, isChecked: boolean) => {
    setSelectedEquipment(prev => {
      const newMap = new Map(prev);
      if (isChecked) {
        if (!newMap.has(equip.id)) {
          newMap.set(equip.id, { quantity: 1, details: equip });
        }
      } else {
        newMap.delete(equip.id);
      }
      return newMap;
    });
  };

  const handleEquipmentQuantityChange = (equipId: string, change: number) => {
    setSelectedEquipment(prev => {
      const newMap = new Map(prev);
      const item = newMap.get(equipId);
      if (item) {
        const newQuantity = Math.max(1, Math.min(item.details.stock, item.quantity + change));
        newMap.set(equipId, { ...item, quantity: newQuantity });
      }
      return newMap;
    });
  };

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) {
      setPromoError("Please enter a promo code.");
      return;
    }
    setIsApplyingPromo(true);
    setPromoError(null);
    
    await new Promise(resolve => setTimeout(resolve, 700));
    const promotion = getPromotionRuleByCode(promoCodeInput.trim());

    if (promotion) {
      const subTotal = baseFacilityPrice + equipmentRentalCost;
      let discountAmount = 0;
      if (promotion.discountType === 'percentage') {
        discountAmount = subTotal * (promotion.discountValue / 100);
      } else { 
        discountAmount = promotion.discountValue;
      }
      discountAmount = Math.min(discountAmount, subTotal);

      setAppliedPromotionDetails({
        code: promotion.code || promotion.name, 
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        description: promotion.name,
      });
      toast({
        title: "Promotion Applied!",
        description: `${promotion.name} (-${formatCurrency(discountAmount, currency)}) applied successfully.`,
        className: "bg-green-500 text-white"
      });
    } else {
      setPromoError("Invalid or expired promo code.");
      setAppliedPromotionDetails(null); 
      toast({
        title: "Promo Code Error",
        description: "The entered promo code is invalid or has expired.",
        variant: "destructive"
      });
    }
    setIsApplyingPromo(false);
  };

  const handleRemovePromotion = () => {
    setAppliedPromotionDetails(null);
    setPromoCodeInput('');
    setPromoError(null);
    toast({
        title: "Promotion Removed",
        description: "The promotion has been removed from your booking.",
    });
  };

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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setBookingStep('confirmation');
    
    if (selectedDate && selectedSlot) {
        setTemporarilyBookedSlots(prev => [
            ...prev,
            { date: format(selectedDate, 'yyyy-MM-dd'), startTime: selectedSlot.startTime }
        ]);
    }

    const bookingDate = selectedDate ? format(selectedDate, 'PPP') : 'N/A';
    const bookingTime = selectedSlot?.startTime || 'N/A';
    
    let rentedItemsSummary = "";
    if (selectedEquipment.size > 0) {
        rentedItemsSummary = " Rented: ";
        selectedEquipment.forEach(item => {
            rentedItemsSummary += `${item.quantity}x ${item.details.name}, `;
        });
        rentedItemsSummary = rentedItemsSummary.slice(0, -2) + "."; 
    }

    let promotionSummary = "";
    if (appliedPromotionDetails) {
        promotionSummary = ` Promotion Applied: ${appliedPromotionDetails.code} (-${formatCurrency(appliedPromotionDetails.discountAmount, currency)}).`;
    }
    
    toast({
      title: "Booking Confirmed!",
      description: `Your booking for ${facility?.name} on ${bookingDate} at ${bookingTime} for ${numberOfGuests} guest(s) is confirmed.${rentedItemsSummary}${promotionSummary}`,
      className: "bg-green-500 text-white",
      duration: 10000,
    });

    if (facility) {
        addNotification(mockUser.id, {
            type: 'booking_confirmed',
            title: 'Booking Confirmed!',
            message: `Your booking for ${facility.name} (${numberOfGuests} guest(s)) on ${bookingDate} at ${bookingTime} is successful.${rentedItemsSummary}${promotionSummary}`,
            link: '/account/bookings',
        });
    }
  };

  const generateGoogleCalendarLink = () => {
    if (!facility || !selectedDate || !selectedSlot) return '#';

    const [startHour, startMinute] = selectedSlot.startTime.split(':').map(Number);
    
    let eventStartDateLocal = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), startHour, startMinute);
    let eventEndDateLocal = addHours(eventStartDateLocal, bookingDurationHours);

    // Format for Google Calendar (YYYYMMDDTHHMMSSZ)
    const formatToGoogleISO = (date: Date) => formatISO(date).replace(/-|:|\.\d{3}/g, '');
    
    const startTimeUTC = formatToGoogleISO(eventStartDateLocal);
    const endTimeUTC = formatToGoogleISO(eventEndDateLocal);

    const title = encodeURIComponent(`Booking: ${facility.name}`);
    const details = encodeURIComponent(
      `Booking for ${facility.name} on ${format(selectedDate, 'PPP')} at ${selectedSlot.startTime}.\n` +
      `Guests: ${numberOfGuests}\n` +
      (appliedPromotionDetails ? `Promotion: ${appliedPromotionDetails.code} (-${formatCurrency(appliedPromotionDetails.discountAmount, currency)})\n` : '') +
      (selectedEquipment.size > 0 ? `Rented Equipment: ${Array.from(selectedEquipment.values()).map(item => `${item.quantity}x ${item.details.name}`).join(', ')}\n` : '') +
      `Total Cost: ${formatCurrency(totalBookingPrice, currency)}`
    );
    const location = encodeURIComponent(facility.address);

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTimeUTC}/${endTimeUTC}&details=${details}&location=${location}`;
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
  
  const hasRentals = facility.availableEquipment && facility.availableEquipment.length > 0;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Facility
      </Button>
      <PageTitle title={`Book ${facility.name}`} description="Select your preferred date, time, and complete your booking." />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {bookingStep === 'details' && (
            <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary"/> Select Date and Time</CardTitle>
                <CardDescription>Choose an available slot for your activity.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="booking-date" className="mb-2 block">Date</Label>
                  <Calendar
                    id="booking-date"
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} 
                  />
                </div>
                <div>
                  <Label htmlFor="time-slot" className="mb-2 block"><Clock className="inline mr-2 h-4 w-4" />Time Slot</Label>
                  {selectedDate && timeSlots.length > 0 ? (
                    <Select onValueChange={(value) => setSelectedSlot(timeSlots.find(s => s.startTime === value))} value={selectedSlot?.startTime}>
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

            {hasRentals && selectedSlot && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><PackageSearch className="mr-2 h-5 w-5 text-primary"/>Rent Equipment</CardTitle>
                  <CardDescription>Add items to your booking. Prices are per {bookingDurationHours} hour{bookingDurationHours !== 1 ? 's' : ''} if 'per_hour', or fixed if 'per_booking'.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {facility.availableEquipment?.map(equip => (
                    <div key={equip.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id={`equip-${equip.id}`}
                          checked={selectedEquipment.has(equip.id)}
                          onCheckedChange={(checked) => handleEquipmentSelection(equip, !!checked)}
                        />
                        {equip.imageUrl && (
                            <Image src={equip.imageUrl} alt={equip.name} width={40} height={40} className="rounded object-cover" data-ai-hint={equip.dataAiHint || "equipment"}/>
                        )}
                        <div>
                          <Label htmlFor={`equip-${equip.id}`} className="font-medium">{equip.name}</Label>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(equip.pricePerItem, currency)} / {equip.priceType === 'per_booking' ? 'booking' : 'hour'} (Stock: {equip.stock})
                          </p>
                        </div>
                      </div>
                      {selectedEquipment.has(equip.id) && (
                        <div className="flex items-center space-x-2">
                          <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEquipmentQuantityChange(equip.id, -1)} disabled={selectedEquipment.get(equip.id)?.quantity === 1}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center">{selectedEquipment.get(equip.id)?.quantity}</span>
                          <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEquipmentQuantityChange(equip.id, 1)} disabled={(selectedEquipment.get(equip.id)?.quantity || 0) >= equip.stock}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            </>
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
                    {isLoading ? 'Processing...' : `Pay ${formatCurrency(totalBookingPrice, currency)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {bookingStep === 'confirmation' && facility && selectedDate && selectedSlot && (
            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Thank you, {mockUser.name}!</p>
                <p className="mb-1">Your booking for <strong>{facility.name}</strong> is confirmed.</p>
                <p className="mb-1">Date: <strong>{format(selectedDate, 'PPP')}</strong></p>
                <p className="mb-1">Time: <strong>{selectedSlot?.startTime} - {selectedSlot?.endTime}</strong> ({bookingDurationHours} hr{bookingDurationHours !== 1 ? 's' : ''})</p>
                <p className="mb-1">Number of Guests: <strong>{numberOfGuests}</strong></p>
                {appliedPricingRuleMessage && (
                  <p className="text-sm text-blue-600 mt-1">Pricing: {appliedPricingRuleMessage}</p>
                )}
                {selectedEquipment.size > 0 && (
                    <div className="mt-3 mb-1 pt-3 border-t">
                        <h4 className="font-semibold text-md mb-1">Rented Equipment:</h4>
                        <ul className="text-sm text-muted-foreground list-none">
                        {Array.from(selectedEquipment.values()).map(item => (
                            <li key={item.details.id}>
                                {item.quantity}x {item.details.name}
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
                {appliedPromotionDetails && (
                    <div className="mt-3 mb-1 pt-3 border-t">
                        <h4 className="font-semibold text-md mb-1">Promotion Applied:</h4>
                        <p className="text-sm text-muted-foreground">{appliedPromotionDetails.description} ({appliedPromotionDetails.code})</p>
                        <p className="text-sm text-muted-foreground">Discount: -{formatCurrency(appliedPromotionDetails.discountAmount, currency)}</p>
                    </div>
                )}
                <p className="text-lg font-semibold mt-2">Total Paid: {formatCurrency(totalBookingPrice, currency)}</p>
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
                 <Button 
                    onClick={() => window.open(generateGoogleCalendarLink(), '_blank')} 
                    variant="outline" 
                    className="w-full"
                 >
                    <Link2 className="mr-2 h-4 w-4" /> Add to Google Calendar
                 </Button>
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
              <CardTitle className="flex items-center"><ShoppingCart className="mr-2 h-5 w-5 text-primary"/>Booking Summary</CardTitle>
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
              {selectedSlot && (
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{bookingDurationHours} hour{bookingDurationHours !== 1 ? 's' : ''}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests:</span>
                <span className="font-medium">{numberOfGuests}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Facility Cost:</span>
                <span className="font-medium">{formatCurrency(baseFacilityPrice, currency)}</span>
              </div>
              {appliedPricingRuleMessage && (
                <div className="flex justify-between text-xs text-blue-600 items-center">
                  <span className="flex items-center"><TrendingUp className="mr-1 h-3 w-3"/>Dynamic Pricing:</span>
                  <span>{appliedPricingRuleMessage}</span>
                </div>
              )}
              {selectedEquipment.size > 0 && (
                <>
                <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Equipment:</span>
                    <div className="text-right">
                    {Array.from(selectedEquipment.values()).map(item => (
                        <div key={item.details.id} className="text-xs">
                        {item.quantity}x {item.details.name}
                        </div>
                    ))}
                    </div>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Rental Cost:</span>
                    <span className="font-medium">{formatCurrency(equipmentRentalCost, currency)}</span>
                 </div>
                </>
              )}

              {bookingStep === 'details' && (
                <div className="pt-2 space-y-2">
                  <Label htmlFor="promo-code" className="text-sm font-medium">Promo Code</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="promo-code" 
                      placeholder="Enter code" 
                      value={promoCodeInput} 
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      disabled={isApplyingPromo || !!appliedPromotionDetails}
                      className="h-9"
                    />
                    <Button 
                      type="button" 
                      onClick={handleApplyPromoCode} 
                      disabled={isApplyingPromo || !promoCodeInput || !!appliedPromotionDetails}
                      variant="outline"
                      size="sm"
                    >
                      {isApplyingPromo ? <LoadingSpinner size={16} /> : 'Apply'}
                    </Button>
                  </div>
                  {promoError && <p className="text-xs text-destructive mt-1">{promoError}</p>}
                </div>
              )}

              {appliedPromotionDetails && (
                <div className="pt-2 border-t mt-2">
                    <div className="flex justify-between items-center text-sm text-green-600">
                        <span>Promo: {appliedPromotionDetails.code}</span>
                        <span>-{formatCurrency(appliedPromotionDetails.discountAmount, currency)}</span>
                    </div>
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs text-destructive" onClick={handleRemovePromotion}>
                        <X className="mr-1 h-3 w-3"/>Remove promotion
                    </Button>
                </div>
              )}

              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(totalBookingPrice, currency)}</span>
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

    