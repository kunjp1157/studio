

'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Facility, TimeSlot, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, PricingRule, SiteSettings, Sport, Booking, BlockedSlot, SportPrice } from '@/lib/types';
import { getFacilityById, mockUser, addNotification, getPromotionRuleByCode, calculateDynamicPrice, isUserOnWaitlist, addToWaitlist, addBooking, getBookingsForFacilityOnDate, getSiteSettings, getUserById } from '@/lib/data';
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
import { AlertCircle, CheckCircle, CreditCard, CalendarDays, Clock, Users, DollarSign, ArrowLeft, PackageSearch, Minus, Plus, ShoppingCart, Tag, X, TrendingUp, Link2, BellRing, HandCoins, Dices, QrCode } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInHours, parse, formatISO, addHours, startOfDay } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const generateTimeSlots = (
  bookedSlots: string[],
  blockedSlots: BlockedSlot[]
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 22;

  for (let i = startHour; i < endHour; i++) {
    const startTime = `${String(i).padStart(2, '0')}:00`;
    const endTime = `${String(i + 1).padStart(2, '0')}:00`;
    
    let isAvailable = !bookedSlots.includes(startTime);

    if(isAvailable) {
        for (const blocked of blockedSlots) {
            // Check if the current 1-hour slot (startTime to endTime) overlaps with a blocked slot
            if (startTime < blocked.endTime && endTime > blocked.startTime) {
                isAvailable = false;
                break; 
            }
        }
    }

    slots.push({ startTime, endTime, isAvailable });
  }
  return slots;
};

// Simple UPI Icon component
const UpiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5">
        <path d="M6.46 9.36L4.7 11.12L3 9.46L4.76 7.7L6.46 9.36ZM10 10.9V7.1H8V15H10V12.7C11.39 12.7 12.5 11.94 12.5 10.2C12.5 8.76 11.5 7.6 10 7.6C8.5 7.6 7.5 8.76 7.5 10.2C7.5 11.94 8.61 12.7 10 12.7V10.9H10ZM10 9.4H10.5C10.94 9.4 11.2 9.7 11.2 10.1C11.2 10.5 10.94 10.8 10.5 10.8H10V9.4ZM17.1 7.1L15 11.5L12.9 7.1H11V15H12.9V10.7L14.4 14H15.6L17.1 10.7V15H19V7.1H17.1Z" fill="#1A237E"/>
        <path d="M21 9.46L19.3 11.12L21 12.78L22.76 11.12L21 9.46Z" fill="#1A237E"/>
    </svg>
);


export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const facilityId = params.id as string;

  const [facility, setFacility] = useState<Facility | null | undefined>(undefined);
  const [selectedSportId, setSelectedSportId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
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
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [isLoading, setIsLoading] = useState(false);
  
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cash' | 'qr'>('card');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (facilityId) {
      getFacilityById(facilityId).then(foundFacility => {
          setFacility(foundFacility || null);
      });
    }
    const settings = getSiteSettings();
    setCurrency(settings.defaultCurrency);
  }, [facilityId]);

  const fetchAndUpdateSlots = useCallback(async (date: Date) => {
    if (!facilityId || !facility) return;
    setIsSlotsLoading(true);
    try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const bookings = await getBookingsForFacilityOnDate(facilityId, formattedDate);
        const bookedStartTimes = bookings.map(b => b.startTime);
        
        const dateSpecificBlockedSlots = facility.blockedSlots?.filter(s => s.date === formattedDate) || [];
        const slots = generateTimeSlots(bookedStartTimes, dateSpecificBlockedSlots);
        setTimeSlots(slots);
    } catch (error) {
        console.error("Error fetching bookings for slots:", error);
        toast({ title: "Error", description: "Could not fetch available slots.", variant: "destructive" });
        setTimeSlots(generateTimeSlots([], [])); // Show all as available on error
    } finally {
        setIsSlotsLoading(false);
        setSelectedSlot(undefined);
    }
  }, [facilityId, facility, toast]);

  useEffect(() => {
    if (selectedDate) {
        fetchAndUpdateSlots(selectedDate);
    }
  }, [selectedDate, fetchAndUpdateSlots]);

  useEffect(() => {
    if (selectedSlot && selectedDate && facility && mockUser) {
        const onWaitlist = isUserOnWaitlist(mockUser.id, facility.id, format(selectedDate, 'yyyy-MM-dd'), selectedSlot.startTime);
        setIsOnWaitlist(onWaitlist);
    }
  }, [selectedSlot, selectedDate, facility]);
  
  const bookingDurationHours = useMemo(() => {
    if (selectedSlot && selectedDate) {
      try {
        const slotStartDate = parse(selectedSlot.startTime, 'HH:mm', selectedDate);
        const slotEndDate = parse(selectedSlot.endTime, 'HH:mm', selectedDate);
        if (slotEndDate < slotStartDate) slotEndDate.setDate(slotEndDate.getDate() + 1); // Handle midnight crossover
        const diff = differenceInHours(slotEndDate, slotEndDate);
        return diff > 0 ? diff : 1; 
      } catch (error) {
        console.error("Error parsing slot times:", error);
        return 1; 
      }
    }
    return 1; 
  }, [selectedSlot, selectedDate]);


  useEffect(() => {
    if (facility && selectedDate && selectedSlot && selectedSportId && currency) {
      const sportPriceInfo = facility.sportPrices.find(p => p.sportId === selectedSportId);
      if (!sportPriceInfo) {
        setBaseFacilityPrice(0);
        setAppliedPricingRuleMessage(null);
        return;
      }
      
      const { finalPrice, appliedRuleName, appliedRuleDetails } = calculateDynamicPrice(
        sportPriceInfo.price,
        selectedDate,
        selectedSlot,
        bookingDurationHours
      );
      
      let calculatedBasePrice = finalPrice;
      if (sportPriceInfo.pricingModel === 'per_hour_per_person') {
          calculatedBasePrice *= parseInt(numberOfGuests, 10) || 1;
      }
      setBaseFacilityPrice(calculatedBasePrice);

      if (appliedRuleName && appliedRuleDetails) {
        let changeDescription = "";
        const newHourlyRate = finalPrice / bookingDurationHours;

        switch (appliedRuleDetails.adjustmentType) {
            case 'percentage_increase': changeDescription = `(+${appliedRuleDetails.value}%)`; break;
            case 'percentage_decrease': changeDescription = `(-${appliedRuleDetails.value}%)`; break;
            case 'fixed_increase': changeDescription = `(+${formatCurrency(appliedRuleDetails.value, currency)}/hr)`; break;
            case 'fixed_decrease': changeDescription = `(-${formatCurrency(appliedRuleDetails.value, currency)}/hr)`; break;
            case 'fixed_price': changeDescription = `(to ${formatCurrency(appliedRuleDetails.value, currency)}/hr)`; break;
        }
        if (newHourlyRate !== sportPriceInfo.price) {
             setAppliedPricingRuleMessage(`${appliedRuleName} ${changeDescription}`);
        } else {
            setAppliedPricingRuleMessage(null); 
        }
      } else {
        setAppliedPricingRuleMessage(null);
      }
    } else {
      setBaseFacilityPrice(0);
      setAppliedPricingRuleMessage(null);
    }
  }, [facility, selectedDate, selectedSlot, bookingDurationHours, currency, selectedSportId, numberOfGuests]);

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

    if (currency) {
        const upiData = new URLSearchParams({
            pa: 'mock-merchant@upi',
            pn: 'Sports Arena',
            am: finalPrice.toFixed(2),
            cu: currency,
        }).toString();
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?${upiData}`);
    }
  }, [baseFacilityPrice, equipmentRentalCost, appliedPromotionDetails, currency]);


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
    if (!currency) return; // Guard against missing currency
    setIsApplyingPromo(true);
    setPromoError(null);
    
    await new Promise(resolve => setTimeout(resolve, 700));
    const promotion = await getPromotionRuleByCode(promoCodeInput.trim());

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
    if (!selectedDate || !selectedSlot || !facility || !selectedSportId) {
      toast({
        title: "Missing Information",
        description: "Please select a sport, date, and time slot.",
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
    if (!currency || !selectedSportId || !facility || !selectedDate || !selectedSlot) {
        toast({ title: "Error", description: "Missing booking details. Please start over.", variant: "destructive" });
        return;
    };

    if (paymentMethod === 'upi' && !upiId.trim()) {
        toast({ title: 'UPI ID Required', description: 'Please enter your UPI ID to proceed.', variant: 'destructive' });
        return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isPayAtVenue = paymentMethod === 'cash';
    const isQrPayment = paymentMethod === 'qr';

    try {
        await addBooking({
            userId: mockUser.id,
            facilityId: facility.id,
            facilityName: facility.name,
            facilityImage: facility.images[0] || '',
            dataAiHint: facility.dataAiHint,
            sportId: selectedSportId,
            sportName: facility.sports.find(s => s.id === selectedSportId)?.name || 'Unknown Sport',
            date: format(selectedDate, 'yyyy-MM-dd'),
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            durationHours: bookingDurationHours,
            numberOfGuests: parseInt(numberOfGuests, 10),
            baseFacilityPrice: baseFacilityPrice,
            equipmentRentalCost: equipmentRentalCost,
            appliedPromotion: appliedPromotionDetails || undefined,
            totalPrice: totalBookingPrice,
            status: isPayAtVenue || isQrPayment ? 'Pending' : 'Confirmed',
            reviewed: false,
            rentedEquipment: Array.from(selectedEquipment.values()).map(item => ({
                equipmentId: item.details.id,
                name: item.details.name,
                quantity: item.quantity,
                priceAtBooking: item.details.pricePerItem,
                priceTypeAtBooking: item.details.priceType,
                totalCost: item.details.priceType === 'per_booking'
                    ? item.details.pricePerItem * item.quantity
                    : item.details.pricePerItem * item.quantity * bookingDurationHours,
            })),
        });

        // SIMULATE SMS SENDING
        const settings = getSiteSettings();
        const smsTemplate = settings.notificationTemplates?.find(t => t.type === 'booking_confirmed' && t.smsEnabled);
        const user = getUserById(mockUser.id);
        if (smsTemplate && user?.phone) {
            console.log(`[SIMULATED SMS] To: ${user.phone}, Body: ${smsTemplate.smsBody}`);
            addNotification(mockUser.id, {
                type: 'general',
                title: 'SMS Sent',
                message: `A booking confirmation was sent to your phone at ${user.phone}.`,
                iconName: 'MessageSquare'
            });
        }


        setIsLoading(false);
        setBookingStep('confirmation');
        
        const toastTitle = isPayAtVenue || isQrPayment ? "Booking Pending" : "Booking Confirmed!";
        let toastDescription = `Your booking for ${facility.name} on ${format(selectedDate, 'PPP')} at ${selectedSlot.startTime} is successful.`;
        if (isPayAtVenue) toastDescription += ' Please pay at the venue to confirm.';
        if (isQrPayment) toastDescription += ' We will confirm your booking once payment is received.';
        
        toast({
          title: toastTitle,
          description: toastDescription,
          className: isPayAtVenue || isQrPayment ? "" : "bg-green-500 text-white",
          duration: 8000,
        });
        
        addNotification(mockUser.id, {
            type: 'booking_confirmed',
            title: toastTitle,
            message: toastDescription,
            link: '/account/bookings',
        });
    } catch (error) {
        setIsLoading(false);
        toast({ title: "Booking Failed", description: "Could not save the booking. Please try again.", variant: "destructive" });
    }
  };


  const handleJoinWaitlist = async () => {
    if (!facility || !selectedDate || !selectedSlot) return;

    setIsJoiningWaitlist(true);
    try {
        await addToWaitlist(mockUser.id, facility.id, format(selectedDate, 'yyyy-MM-dd'), selectedSlot.startTime);
        toast({
            title: "Added to Waitlist!",
            description: `We'll notify you if the ${selectedSlot.startTime} slot at ${facility.name} becomes available.`,
        });
        setIsOnWaitlist(true);
    } catch (error) {
        toast({ title: "Error", description: "Could not add to waitlist. Please try again.", variant: "destructive" });
    } finally {
        setIsJoiningWaitlist(false);
    }
  };

  const generateGoogleCalendarLink = () => {
    if (!facility || !selectedDate || !selectedSlot || !currency || !selectedSportId) return '#';

    const [startHour, startMinute] = selectedSlot.startTime.split(':').map(Number);
    
    let eventStartDateLocal = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), startHour, startMinute);
    let eventEndDateLocal = addHours(eventStartDateLocal, bookingDurationHours);

    const formatToGoogleISO = (date: Date) => formatISO(date).replace(/-|:|\.\d{3}/g, '');
    
    const startTimeUTC = formatToGoogleISO(eventStartDateLocal);
    const endTimeUTC = formatToGoogleISO(eventEndDateLocal);

    const sportName = facility.sports.find(s => s.id === selectedSportId)?.name || 'Sport';
    const title = encodeURIComponent(`Booking: ${facility.name} (${sportName})`);
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

  const renderPrice = (price: number) => {
    if (!currency) return <Skeleton className="h-5 w-20 inline-block" />;
    return formatCurrency(price, currency);
  };

  const selectedSportPriceInfo = selectedSportId ? facility.sportPrices.find(p => p.sportId === selectedSportId) : null;
  const selectedSportInfo = selectedSportId ? facility.sports.find(s => s.id === selectedSportId) : null;

  const getPriceDisplay = () => {
    if (!selectedSportPriceInfo) {
      return <span>N/A</span>;
    }
    const priceText = renderPrice(selectedSportPriceInfo.price);
    if (selectedSportPriceInfo.pricingModel === 'per_hour_per_person') {
      return <span>{priceText} / person / hour</span>;
    }
    return <span>{priceText} / hour</span>;
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Facility
      </Button>
      <PageTitle title={`Book ${facility.name}`} description="Select your preferred sport, date, time, and complete your booking." />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {bookingStep === 'details' && (
            <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Dices className="mr-2 h-5 w-5 text-primary"/>Select Your Sport</CardTitle>
                <CardDescription>The price per hour varies depending on the sport you choose.</CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={setSelectedSportId} value={selectedSportId}>
                    <SelectTrigger><SelectValue placeholder="Choose a sport to play" /></SelectTrigger>
                    <SelectContent>
                        {facility.sports.map(sport => (
                            <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className={!selectedSportId ? 'opacity-50 pointer-events-none' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary"/> Select Date and Time</CardTitle>
                <CardDescription>Choose an available slot for your activity. {!selectedSportId && '(Please select a sport first)'}</CardDescription>
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
                    disabled={(date) => date < startOfDay(new Date())} 
                  />
                </div>
                <div>
                  <Label htmlFor="time-slot" className="mb-2 block"><Clock className="inline mr-2 h-4 w-4" />Time Slot</Label>
                  {isSlotsLoading ? (
                      <div className="flex items-center justify-center h-10 border rounded-md"><LoadingSpinner size={20}/></div>
                  ) : selectedDate && timeSlots.length > 0 ? (
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
                  {selectedSlot && !selectedSlot.isAvailable && (
                    <Alert variant="default" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Slot Unavailable</AlertTitle>
                        <AlertDescription>
                            This time slot is currently booked. You can join the waitlist to be notified if it becomes available.
                        </AlertDescription>
                        <div className="mt-4">
                            {isOnWaitlist ? (
                                <Button disabled variant="outline" className="w-full">
                                    <CheckCircle className="mr-2 h-4 w-4" /> You're on the waitlist
                                </Button>
                            ) : (
                                <Button onClick={handleJoinWaitlist} disabled={isJoiningWaitlist} className="w-full">
                                    {isJoiningWaitlist ? <LoadingSpinner size={16} className="mr-2"/> : <BellRing className="mr-2 h-4 w-4" />}
                                    Join Waitlist
                                </Button>
                            )}
                        </div>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {hasRentals && selectedSlot && selectedSlot.isAvailable && (
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
                            {renderPrice(equip.pricePerItem)} / {equip.priceType === 'per_booking' ? 'booking' : 'hour'} (Stock: {equip.stock})
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
                <CardDescription>Select a payment method to complete the booking.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'upi' | 'cash' | 'qr')}>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center text-base"><CreditCard className="mr-2 h-5 w-5"/> Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex items-center text-base"><UpiIcon /> UPI</Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                          <RadioGroupItem value="qr" id="qr" />
                          <Label htmlFor="qr" className="flex items-center text-base"><QrCode className="mr-2 h-5 w-5"/> Scan QR Code</Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex items-center text-base"><HandCoins className="mr-2 h-5 w-5"/> Pay at Venue</Label>
                      </div>
                  </RadioGroup>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4 border-t">
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
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                     <div className="space-y-4 pt-4 border-t">
                        <div>
                            <Label htmlFor="upi-id">UPI ID</Label>
                            <Input 
                                id="upi-id" 
                                type="text" 
                                placeholder="yourname@bank" 
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                required 
                            />
                        </div>
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>How UPI works</AlertTitle>
                            <AlertDescription>
                                After clicking "Pay", you will receive a payment request on your UPI app. You must approve it to confirm the booking.
                            </AlertDescription>
                        </Alert>
                    </div>
                  )}
                  
                  {paymentMethod === 'qr' && qrCodeUrl && (
                    <div className="space-y-4 pt-4 border-t text-center">
                        <p className="text-sm text-muted-foreground">Scan the QR code below with your UPI app to pay.</p>
                        <div className="flex justify-center">
                            <Image
                                src={qrCodeUrl}
                                alt="Scan to pay"
                                width={200}
                                height={200}
                                className="rounded-md border"
                            />
                        </div>
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>After Payment</AlertTitle>
                            <AlertDescription>
                                Once your payment is complete, click the button below to finalize your booking. We will verify the payment.
                            </AlertDescription>
                        </Alert>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                     <div className="space-y-4 pt-4 border-t">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Pay at Venue</AlertTitle>
                            <AlertDescription>
                                You have selected to pay at the venue. Your booking will be confirmed immediately, and payment will be due upon arrival.
                            </AlertDescription>
                        </Alert>
                    </div>
                  )}

                   <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size={20} className="mr-2"/> : (paymentMethod === 'card' ? <CreditCard className="mr-2 h-5 w-5" /> : (paymentMethod === 'upi' ? <UpiIcon /> : (paymentMethod === 'cash' ? <HandCoins className="mr-2 h-5 w-5" /> : <QrCode className="mr-2 h-5 w-5" />)))}
                    {isLoading ? 'Processing...' : (paymentMethod === 'cash' ? 'Confirm Booking' : (paymentMethod === 'qr' ? 'I Have Paid' : `Pay ${renderPrice(totalBookingPrice)}`))}
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
                <p className="mb-1">Your booking for <strong>{facility.name}</strong> for <strong>{selectedSportInfo?.name}</strong> is confirmed.</p>
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
                        <p className="text-sm text-muted-foreground">Discount: -{renderPrice(appliedPromotionDetails.discountAmount)}</p>
                    </div>
                )}
                <p className="text-lg font-semibold mt-2">Total {paymentMethod === 'cash' ? 'Due' : 'Paid'}: {renderPrice(totalBookingPrice)}</p>
                <Alert className="mt-4 text-left">
                  <AlertCircle className="h-4 w-4"/>
                  <AlertTitle>What's Next?</AlertTitle>
                  <AlertDescription>
                    {paymentMethod === 'cash'
                      ? 'Your slot is reserved! Please pay the total amount at the facility upon arrival.'
                      : 'You will receive an email confirmation shortly with all your booking details.'
                    }
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
                <span className="text-muted-foreground">Sport:</span>
                <span className="font-medium">{selectedSportInfo?.name || 'Not Selected'}</span>
              </div>
              {selectedSportPriceInfo && (
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="font-medium">{getPriceDisplay()}</span>
                </div>
              )}
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
                <span className="font-medium">{renderPrice(baseFacilityPrice)}</span>
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
                    <span className="font-medium">{renderPrice(equipmentRentalCost)}</span>
                 </div>
                </>
              )}

              {bookingStep === 'details' && selectedSlot?.isAvailable && (
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
                        <span>-{renderPrice(appliedPromotionDetails.discountAmount)}</span>
                    </div>
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs text-destructive" onClick={handleRemovePromotion}>
                        <X className="mr-1 h-3 w-3"/>Remove promotion
                    </Button>
                </div>
              )}

              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{renderPrice(totalBookingPrice)}</span>
              </div>
            </CardContent>
            {bookingStep === 'details' && (
              <CardFooter>
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={proceedToPayment} 
                  disabled={!selectedDate || !selectedSlot || !numberOfGuests || parseInt(numberOfGuests) < 1 || !selectedSlot.isAvailable || !selectedSportId}
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
