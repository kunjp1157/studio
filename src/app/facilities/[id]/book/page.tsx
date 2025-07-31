
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { mockUser, getPromotionRuleByCode, addBooking, addNotification, getSiteSettings } from '@/lib/data';
import type { Booking, SiteSettings, PromotionRule, AppliedPromotionInfo, RentedItemInfo } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Ticket, CalendarDays, Clock, Home, BadgePercent, Tag, AlertCircle, ArrowLeft, CreditCard, QrCode, PackageSearch } from 'lucide-react';
import Image from 'next/image';

const UpiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5">
        <path d="M6.46 9.36L4.7 11.12L3 9.46L4.76 7.7L6.46 9.36ZM10 10.9V7.1H8V15H10V12.7C11.39 12.7 12.5 11.94 12.5 10.2C12.5 8.76 11.5 7.6 10 7.6C8.5 7.6 7.5 8.76 7.5 10.2C7.5 11.94 8.61 12.7 10 12.7V10.9H10ZM10 9.4H10.5C10.94 9.4 11.2 9.7 11.2 10.1C11.2 10.5 10.94 10.8 10.5 10.8H10V9.4ZM17.1 7.1L15 11.5L12.9 7.1H11V15H12.9V10.7L14.4 14H15.6L17.1 10.7V15H19V7.1H17.1Z" fill="#1A237E"/>
        <path d="M21 9.46L19.3 11.12L21 12.78L22.76 11.12L21 9.46Z" fill="#1A237E"/>
    </svg>
);


function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [bookingData, setBookingData] = useState<Omit<Booking, 'id' | 'bookedAt'> | null>(null);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState<AppliedPromotionInfo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'qr'>('card');
  const [upiId, setUpiId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const dataString = searchParams.get('data');
    if (dataString) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataString));
        setBookingData(parsedData);
      } catch (error) {
        console.error("Failed to parse booking data", error);
        toast({title: "Error", description: "Invalid booking data provided.", variant: "destructive"});
        router.push('/facilities');
      }
    }
    const settings = getSiteSettings();
    setCurrency(settings.defaultCurrency);
  }, [searchParams, router, toast]);

  useEffect(() => {
    if (paymentMethod === 'qr' && bookingData && currency) {
        const upiData = new URLSearchParams({
            pa: 'merchant-upi@bank', // Mock merchant UPI
            pn: 'Sports Arena Booking',
            am: (bookingData.totalPrice - (appliedPromotion?.discountAmount || 0)).toFixed(2),
            cu: currency,
            tn: `Booking for ${bookingData.facilityName}`
        }).toString();
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?${upiData}`);
    }
  }, [paymentMethod, bookingData, currency, appliedPromotion]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    setPromoError(null);
    try {
        const promo = await getPromotionRuleByCode(promoCode);
        if (promo && bookingData) {
            let discountAmount = 0;
            if (promo.discountType === 'percentage') {
                discountAmount = bookingData.totalPrice * (promo.discountValue / 100);
            } else {
                discountAmount = promo.discountValue;
            }
            discountAmount = Math.min(discountAmount, bookingData.totalPrice);
            setAppliedPromotion({ code: promo.code!, discountAmount, description: promo.name });
            toast({ title: "Promotion Applied!", description: `You've received a discount of ${formatCurrency(discountAmount, currency!)}.`});
        } else {
            setPromoError("Invalid or expired promotion code.");
        }
    } catch (e) {
        setPromoError("Could not apply promotion code.");
    } finally {
        setIsApplyingPromo(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingData) return;
    setIsConfirming(true);

    if (paymentMethod === 'upi' && !upiId.trim()) {
        toast({ title: 'UPI ID Required', description: 'Please enter your UPI ID.', variant: 'destructive' });
        setIsConfirming(false);
        return;
    }

    const finalPrice = bookingData.totalPrice - (appliedPromotion?.discountAmount || 0);

    // Simulate payment processing
    await new Promise(res => setTimeout(res, 2000));
    
    const newBooking = await addBooking({
      ...bookingData,
      totalPrice: finalPrice,
      appliedPromotion: appliedPromotion || undefined,
    });
    
    addNotification(mockUser.id, {
        type: 'booking_confirmed',
        title: 'Booking Confirmed!',
        message: `Your booking for ${newBooking.facilityName} is confirmed.`,
        link: '/account/bookings',
        iconName: 'CheckCircle',
    });

    toast({
      title: "Booking Confirmed!",
      description: `Your reservation at ${newBooking.facilityName} is complete.`,
    });
    router.push('/account/bookings');
  };

  if (!bookingData || !currency) {
    return (
        <div className="flex justify-center items-center h-64">
            <LoadingSpinner size={48} />
        </div>
    );
  }

  const finalPrice = bookingData.totalPrice - (appliedPromotion?.discountAmount || 0);

  return (
    <>
      <PageTitle title="Confirm Your Booking" description="Review your booking details and confirm your payment." />
      <div className="grid md:grid-cols-2 gap-8 items-start mt-8">
        <Card className="shadow-lg">
            <CardHeader><CardTitle>Booking Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Facility</span><span className="font-semibold">{bookingData.facilityName}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Sport</span><span className="font-semibold">{bookingData.sportName}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Date</span><span className="font-semibold">{format(parseISO(bookingData.date), 'EEEE, MMM d, yyyy')}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Time</span><span className="font-semibold">{bookingData.startTime} - {bookingData.endTime}</span></div>
                <hr/>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Base Price</span><span className="font-semibold">{formatCurrency(bookingData.baseFacilityPrice!, currency)}</span></div>
                {bookingData.equipmentRentalCost! > 0 && (
                  <div className="flex justify-between items-center"><span className="text-muted-foreground">Equipment Rentals</span><span className="font-semibold">{formatCurrency(bookingData.equipmentRentalCost!, currency)}</span></div>
                )}
                {bookingData.rentedEquipment && bookingData.rentedEquipment.length > 0 && (
                  <div className="pl-4 space-y-1">
                    {bookingData.rentedEquipment.map(item => (
                      <div key={item.equipmentId} className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>{formatCurrency(item.totalCost, currency)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {appliedPromotion && (
                     <div className="flex justify-between items-center text-green-600"><span className="text-muted-foreground">Discount ({appliedPromotion.code})</span><span className="font-semibold">- {formatCurrency(appliedPromotion.discountAmount, currency)}</span></div>
                )}
                <hr/>
                <div className="flex justify-between items-center text-xl"><span className="text-foreground font-bold">Total Price</span><span className="font-bold text-primary">{formatCurrency(finalPrice, currency)}</span></div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
                 <Label htmlFor="promo-code">Have a promo code?</Label>
                 <div className="flex w-full space-x-2">
                    <Input id="promo-code" placeholder="Enter code" value={promoCode} onChange={e => setPromoCode(e.target.value)} disabled={isApplyingPromo || !!appliedPromotion}/>
                    <Button onClick={handleApplyPromo} disabled={!promoCode || isApplyingPromo || !!appliedPromotion}>
                        {isApplyingPromo ? <LoadingSpinner size={20}/> : "Apply"}
                    </Button>
                 </div>
                 {promoError && <p className="text-destructive text-xs">{promoError}</p>}
            </CardFooter>
        </Card>
        
        <Card className="shadow-lg">
            <CardHeader><CardTitle>Payment Method</CardTitle><CardDescription>This is a mock payment screen.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <input type="radio" id="card" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                    <Label htmlFor="card" className="flex items-center text-base"><CreditCard className="mr-2 h-5 w-5"/> Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                     <input type="radio" id="upi" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                    <Label htmlFor="upi" className="flex items-center text-base"><UpiIcon /> UPI</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                     <input type="radio" id="qr" name="payment" value="qr" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} />
                    <Label htmlFor="qr" className="flex items-center text-base"><QrCode className="mr-2 h-5 w-5"/> Scan QR Code</Label>
                </div>

                {paymentMethod === 'upi' && (
                     <div className="mt-4">
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
                )}
                 {paymentMethod === 'qr' && qrCodeUrl && (
                     <div className="mt-4 space-y-4 pt-4 border-t text-center">
                        <p className="text-sm text-muted-foreground">Scan the QR code below with your UPI app to pay.</p>
                        <div className="flex justify-center">
                            <Image
                                src={qrCodeUrl}
                                alt="Scan to pay for booking"
                                width={180}
                                height={180}
                                className="rounded-md border"
                            />
                        </div>
                         <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>After Payment</AlertTitle>
                            <AlertDescription>
                                Once your payment is complete, click the confirm button below to finalize your booking.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col space-y-2">
                <Button className="w-full" size="lg" onClick={handleConfirmBooking} disabled={isConfirming}>
                    {isConfirming ? <LoadingSpinner size={20} className="mr-2"/> : <Ticket className="mr-2 h-4 w-4"/>}
                    {isConfirming ? "Confirming..." : `Pay & Confirm Booking`}
                </Button>
                <Button className="w-full" variant="outline" onClick={() => router.back()} disabled={isConfirming}>
                    <ArrowLeft className="mr-2 h-4 w-4"/> Go Back & Edit
                </Button>
            </CardFooter>
        </Card>
      </div>
    </>
  );
}


export default function BookingPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Suspense fallback={<div className="flex justify-center items-center h-64"><LoadingSpinner size={48}/></div>}>
        <BookingConfirmationContent />
      </Suspense>
    </div>
  )
}
