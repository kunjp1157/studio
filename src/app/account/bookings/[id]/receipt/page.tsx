
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Booking, Facility, SiteSettings } from '@/lib/types';
import { getBookingByIdAction, getFacilityByIdAction, getSiteSettingsAction } from '@/app/actions';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Home, Calendar, Clock, DollarSign, QrCode, Printer, Download, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const QrCodeDisplay = ({ bookingDetails }: { bookingDetails: string }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
  
    useEffect(() => {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingDetails)}`;
      setQrCodeUrl(url);
    }, [bookingDetails]);
  
    if (!qrCodeUrl) {
      return <Skeleton className="w-52 h-52 mx-auto" />;
    }
  
    // Using a regular img tag as next/image doesn't work well with external dynamic URLs like this.
    return <img src={qrCodeUrl} alt="Booking QR Code" width="200" height="200" className="mx-auto rounded-lg border p-1" />;
};
  

export default function BookingReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const bookingId = params.id as string;
  const receiptRef = useRef<HTMLDivElement>(null);

  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [facility, setFacility] = useState<Facility | null | undefined>(undefined);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (bookingId) {
        const foundBooking = await getBookingByIdAction(bookingId);
        setBooking(foundBooking || null);
        if (foundBooking) {
          const foundFacility = await getFacilityByIdAction(foundBooking.facilityId);
          setFacility(foundFacility || null);
        }
        const settings = await getSiteSettingsAction();
        setCurrency(settings.defaultCurrency);
      }
    };
    fetchBookingData();
  }, [bookingId]);
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setIsProcessing(true);
    toast({ title: "Preparing Download...", description: "Your PDF is being generated." });
    
    try {
        const canvas = await html2canvas(receiptRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`receipt-${bookingId}.pdf`);
    } catch(error) {
        console.error("Failed to generate PDF:", error);
        toast({ title: "Error", description: "Could not generate PDF.", variant: "destructive" });
    } finally {
        setIsProcessing(false);
    }
  };

  if (booking === undefined || currency === null) {
    return <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size={48} /></div>;
  }

  if (!booking) {
    notFound();
  }

  const qrCodeDetails = `Booking ID: ${booking.id}\nFacility: ${booking.facilityName}\nDate: ${booking.date}\nTime: ${booking.startTime} - ${booking.endTime}\nSport: ${booking.sportName}`;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
      <div id="print-hide">
        <Button variant="outline" onClick={() => router.push('/account/bookings')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Bookings
        </Button>

        <Alert className="mb-8 border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 [&>svg]:text-green-500">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">Booking Confirmed!</AlertTitle>
            <AlertDescription>
            Your booking is complete. You can show the QR code at the facility.
            </AlertDescription>
        </Alert>
      </div>

      <Card className="shadow-lg" ref={receiptRef} id="receipt-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Booking Receipt</CardTitle>
          <CardDescription>Booking ID: {booking.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-sm">
             <div className="flex items-start">
                <Home className="mr-3 mt-1 h-5 w-5 text-primary" />
                <div>
                    <p className="font-semibold">Facility</p>
                    <p className="text-muted-foreground">{booking.facilityName} - {facility?.location}</p>
                </div>
            </div>
             <div className="flex items-start">
                <Calendar className="mr-3 mt-1 h-5 w-5 text-primary" />
                <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-muted-foreground">{format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}</p>
                </div>
            </div>
            <div className="flex items-start">
                <Clock className="mr-3 mt-1 h-5 w-5 text-primary" />
                <div>
                    <p className="font-semibold">Time</p>
                    <p className="text-muted-foreground">{booking.startTime} - {booking.endTime}</p>
                </div>
            </div>
             <div className="flex items-start">
                <DollarSign className="mr-3 mt-1 h-5 w-5 text-primary" />
                <div>
                    <p className="font-semibold">Total Paid</p>
                    <p className="text-muted-foreground font-bold">{formatCurrency(booking.totalPrice, currency)}</p>
                </div>
            </div>
          </div>
          
          <div className="text-center space-y-2 pt-6 border-t">
            <h3 className="font-semibold flex items-center justify-center">
                <QrCode className="mr-2 h-5 w-5 text-primary"/>
                Your Booking QR Code
            </h3>
            <div className="p-2">
                <QrCodeDisplay bookingDetails={qrCodeDetails} />
            </div>
            <p className="text-xs text-muted-foreground">Show this code at the facility for verification.</p>
          </div>
        </CardContent>
      </Card>
      
      <CardFooter className="gap-2 mt-4" id="print-hide-footer">
            <Button className="w-full" variant="outline" onClick={handlePrint} disabled={isProcessing}>
                <Printer className="mr-2 h-4 w-4"/> Print Receipt
            </Button>
             <Button className="w-full" variant="outline" onClick={handleDownload} disabled={isProcessing}>
                {isProcessing ? <LoadingSpinner size={16} className="mr-2"/> : <Download className="mr-2 h-4 w-4"/>}
                {isProcessing ? "Downloading..." : "Download PDF"}
            </Button>
        </CardFooter>
    </div>
  );
}
