

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { StarDisplay } from '@/components/shared/StarDisplay';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ReviewItem } from '@/components/reviews/ReviewItem';
import { useToast } from '@/hooks/use-toast';
import { cn, calculateDynamicPrice } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO, startOfDay, differenceInHours, parse } from 'date-fns';
import {
  MapPin, CalendarDays, Clock, Users, SunMoon, DollarSign, Sparkles, Heart,
  ThumbsUp, ThumbsDown, PackageSearch, Minus, Plus
} from 'lucide-react';
import type { Facility, Review, Sport, TimeSlot, SiteSettings, UserProfile, Booking, RentedItemInfo, RentalEquipment } from '@/lib/types';
import { getSiteSettingsAction, getFacilityByIdAction, toggleFavoriteFacilityAction, getBookingsForFacilityOnDateAction } from '@/app/actions';
import { getIconComponent } from '@/components/shared/Icon';
import { summarizeReviews, type SummarizeReviewsOutput } from '@/ai/flows/summarize-reviews';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const generateTimeSlots = (
  facility: Facility,
  selectedDate: Date | undefined,
  bookingsOnDate: Booking[],
): TimeSlot[] => {
  if (!selectedDate || !facility.operatingHours) return [];
  
  const dayOfWeek = format(selectedDate, 'E').slice(0, 3) as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  const hours = facility.operatingHours.find(h => h.day === dayOfWeek);

  if (!hours) return [];

  const slots: TimeSlot[] = [];
  const startHour = parseInt(hours.open.split(':')[0]);
  const endHour = parseInt(hours.close.split(':')[0]);

  const bookedStartTimes = bookingsOnDate.map(b => b.startTime);
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const dateSpecificBlockedSlots = facility.blockedSlots?.filter(s => s.date === formattedDate) || [];

  for (let i = startHour; i < endHour; i++) {
    const startTime = `${String(i).padStart(2, '0')}:00`;
    const endTime = `${String(i + 1).padStart(2, '0')}:00`;
    
    let isAvailable = !bookedStartTimes.includes(startTime);

    if(isAvailable) {
        for (const blocked of dateSpecificBlockedSlots) {
            if (startTime < blocked.endTime && endTime > startTime) {
                isAvailable = false;
                break; 
            }
        }
    }

    slots.push({ startTime, endTime, isAvailable });
  }
  return slots;
};

export default function FacilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const facilityId = params.id as string;
  
  const [facility, setFacility] = useState<Facility | null | undefined>(undefined);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSport, setSelectedSport] = useState<Sport | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>(undefined);
  const [selectedEquipment, setSelectedEquipment] = useState<Record<string, number>>({});
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [reviewSummary, setReviewSummary] = useState<SummarizeReviewsOutput | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem('activeUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
  }, []);

  const fetchFacilityData = useCallback(async () => {
    if (facilityId) {
      const foundFacility = await getFacilityByIdAction(facilityId);
      setFacility(foundFacility || null);
      if (foundFacility?.sports.length && !selectedSport) {
        setSelectedSport(foundFacility.sports[0]);
      }
    }
  }, [facilityId, selectedSport]);

  useEffect(() => {
    fetchFacilityData();
    getSiteSettingsAction().then(setSiteSettings);
  }, [fetchFacilityData]);

  useEffect(() => {
      if(currentUser && facility) {
          setIsFavorited(currentUser.favoriteFacilities?.includes(facility.id) || false);
      }
  }, [currentUser, facility]);

  const fetchSlots = useCallback(async () => {
      if (facility && selectedDate) {
          setIsSlotsLoading(true);
          const formattedDate = format(selectedDate, 'yyyy-MM-dd');
          const bookingsOnDate = await getBookingsForFacilityOnDateAction(facility.id, formattedDate);
          const slots = generateTimeSlots(facility, selectedDate, bookingsOnDate);
          setTimeSlots(slots);
          
          // If the currently selected slot is now booked, deselect it
          if (selectedSlot && !slots.find(s => s.startTime === selectedSlot.startTime)?.isAvailable) {
              setSelectedSlot(undefined);
              toast({
                  title: 'Slot Just Booked',
                  description: `The time slot ${selectedSlot.startTime} is no longer available. Please select another time.`,
                  variant: 'destructive'
              });
          }

          setIsSlotsLoading(false);
      }
  }, [facility, selectedDate, selectedSlot, toast]);


  useEffect(() => {
    fetchSlots(); // Initial fetch
    
    // Set up polling for live availability
    const intervalId = setInterval(fetchSlots, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [fetchSlots]);
  
  const handleGenerateSummary = useCallback(async () => {
    if (!facility || !facility.reviews || facility.reviews.length < 3) return;
    setIsSummaryLoading(true);
    try {
        const summary = await summarizeReviews({ reviews: facility.reviews.map(r => r.comment) });
        setReviewSummary(summary);
    } catch (error) {
        toast({ title: 'AI Summary Failed', description: 'Could not generate review summary.', variant: 'destructive' });
    } finally {
        setIsSummaryLoading(false);
    }
  }, [facility, toast]);

  const bookingDurationHours = useMemo(() => {
    if (selectedSlot) {
      const startTime = parse(selectedSlot.startTime, 'HH:mm', new Date());
      const endTime = parse(selectedSlot.endTime, 'HH:mm', new Date());
      return differenceInHours(endTime, startTime) || 1;
    }
    return 1;
  }, [selectedSlot]);
  
  const sportSpecificEquipment = useMemo(() => {
    if (!facility?.availableEquipment || !selectedSport) {
      return [];
    }
    return facility.availableEquipment.filter(e => e.sportIds.includes(selectedSport.id));
  }, [facility?.availableEquipment, selectedSport]);


  const equipmentRentalCost = useMemo(() => {
    if (sportSpecificEquipment.length === 0 || Object.keys(selectedEquipment).length === 0) {
      return 0;
    }

    return Object.entries(selectedEquipment).reduce((total, [equipmentId, quantity]) => {
      const equipment = sportSpecificEquipment.find(e => e.id === equipmentId);
      if (equipment && quantity > 0) {
        const itemCost = equipment.pricePerItem * quantity;
        if (equipment.priceType === 'per_hour') {
          return total + (itemCost * bookingDurationHours);
        }
        return total + itemCost;
      }
      return total;
    }, 0);
  }, [selectedEquipment, sportSpecificEquipment, bookingDurationHours]);

  const dynamicPrice = useMemo(() => {
    if (facility && selectedSport && selectedDate && selectedSlot) {
      const sportPriceInfo = facility.sportPrices.find(p => p.sportId === selectedSport.id);
      if (!sportPriceInfo) return null;
      
      const priceResult = calculateDynamicPrice(sportPriceInfo.price, selectedDate, selectedSlot, bookingDurationHours);
      
      return {
          ...priceResult,
          pricingModel: sportPriceInfo.pricingModel,
          finalPrice: priceResult.finalPrice + equipmentRentalCost
      };
    }
    return null;
  }, [facility, selectedSport, selectedDate, selectedSlot, bookingDurationHours, equipmentRentalCost]);
  
  const handleEquipmentQuantityChange = (equipmentId: string, change: 1 | -1) => {
    setSelectedEquipment(prev => {
        const currentQuantity = prev[equipmentId] || 0;
        const newQuantity = Math.max(0, currentQuantity + change);
        
        const equipment = sportSpecificEquipment.find(e => e.id === equipmentId);
        if (equipment && newQuantity > equipment.stock) {
            toast({
                title: 'Stock Limit Reached',
                description: `Only ${equipment.stock} units of ${equipment.name} available.`,
                variant: 'destructive',
            });
            return { ...prev, [equipmentId]: equipment.stock };
        }

        if (newQuantity === 0) {
            const { [equipmentId]: _, ...rest } = prev;
            return rest;
        }
        
        return { ...prev, [equipmentId]: newQuantity };
    });
  };
  
  const handleBooking = () => {
    if (!facility || !selectedSport || !selectedDate || !selectedSlot || !dynamicPrice) {
        toast({ title: "Incomplete Selection", description: "Please select a sport, date, and available time slot.", variant: "destructive"});
        return;
    }

    const rentedItems: RentedItemInfo[] = Object.entries(selectedEquipment)
      .map(([equipmentId, quantity]) => {
        const equipment = sportSpecificEquipment.find(e => e.id === equipmentId);
        if (!equipment || quantity <= 0) return null;
        
        const itemCost = equipment.pricePerItem * quantity;
        const totalCost = equipment.priceType === 'per_hour' ? itemCost * bookingDurationHours : itemCost;

        return {
          equipmentId,
          name: equipment.name,
          quantity,
          priceAtBooking: equipment.pricePerItem,
          priceTypeAtBooking: equipment.priceType,
          totalCost
        };
      })
      .filter((item): item is RentedItemInfo => item !== null);

    const bookingData = {
      facilityId: facility.id,
      facilityName: facility.name,
      dataAiHint: facility.dataAiHint,
      sportId: selectedSport.id,
      sportName: selectedSport.name,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      totalPrice: dynamicPrice.finalPrice,
      baseFacilityPrice: dynamicPrice.finalPrice - equipmentRentalCost,
      equipmentRentalCost: equipmentRentalCost,
      status: 'Confirmed' as const,
      userId: currentUser?.id, // Will be undefined if not logged in
      rentedEquipment: rentedItems,
      reviewed: false,
      pricingModel: dynamicPrice.pricingModel,
    };
    
    if (!currentUser) {
        toast({
            title: "Login Required",
            description: "Please log in or create an account to complete your booking.",
        });
        sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
        router.push('/account/login');
        return;
    }
    
    router.push(`/facilities/${facility.id}/book?data=${encodeURIComponent(JSON.stringify(bookingData))}`);
  };

  const handleFavoriteClick = async () => {
    if (!currentUser || !facility) {
      toast({ title: 'Please log in', description: 'You must be logged in to favorite facilities.', variant: 'destructive' });
      return;
    }
    setIsFavoriteLoading(true);
    try {
      const updatedUser = await toggleFavoriteFacilityAction(currentUser.id, facility.id);
      if(updatedUser) {
        setCurrentUser(updatedUser);
        sessionStorage.setItem('activeUser', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userChanged'));
        setIsFavorited(prev => !prev);
        toast({ title: !isFavorited ? 'Added to Favorites' : 'Removed from Favorites'});
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Could not update favorites.', variant: 'destructive' });
    } finally {
      setIsFavoriteLoading(false);
    }
  };
  
  useEffect(() => {
    // Reset equipment selection when sport changes
    setSelectedEquipment({});
  }, [selectedSport]);


  if (facility === undefined) {
    return <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size={48} /></div>;
  }
  if (!facility) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title={facility.name} description={facility.description} />
      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden shadow-lg">
             <div className="w-full h-auto object-cover bg-muted/50 aspect-video flex items-center justify-center">
                 <p className="text-muted-foreground">Image removed</p>
             </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold">{facility.location}</span>
                <span className="text-xs text-muted-foreground">{facility.city}</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                <SunMoon className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold">{facility.isIndoor ? 'Indoor' : 'Outdoor'}</span>
                <span className="text-xs text-muted-foreground">Environment</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold">{facility.capacity || 'N/A'}</span>
                <span className="text-xs text-muted-foreground">Capacity</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                <StarDisplay rating={facility.rating} starSize={24} />
                <span className="text-sm font-semibold">{facility.rating.toFixed(1)} / 5.0</span>
                <span className="text-xs text-muted-foreground">{facility.reviews?.length || 0} reviews</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader><CardTitle>Amenities</CardTitle></CardHeader>
                <CardContent>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                        {facility.amenities.map(amenity => {
                            const Icon = getIconComponent(amenity.iconName);
                            return <li key={amenity.id} className="flex items-center"><Icon className="h-4 w-4 mr-2 text-primary"/>{amenity.name}</li>
                        })}
                    </ul>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Operating Hours</CardTitle></CardHeader>
                <CardContent>
                    <ul className="space-y-1 text-sm">
                        {facility.operatingHours.map(hour => (
                            <li key={hour.day} className="flex justify-between">
                                <span className="font-medium">{hour.day}</span>
                                <span className="text-muted-foreground">{hour.open} - {hour.close}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
          </div>
          
           {sportSpecificEquipment && sportSpecificEquipment.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'><PackageSearch className="mr-2 h-5 w-5 text-primary"/>Rent Equipment (Optional)</CardTitle>
                        <CardDescription>Add rental equipment to your booking. Prices are calculated for your selected time slot duration.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2">
                            {sportSpecificEquipment.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div>
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {siteSettings ? formatCurrency(item.pricePerItem, siteSettings.defaultCurrency) : ''} / {item.priceType === 'per_booking' ? 'booking' : 'hour'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleEquipmentQuantityChange(item.id, -1)} disabled={(selectedEquipment[item.id] || 0) === 0}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-6 text-center font-semibold">{selectedEquipment[item.id] || 0}</span>
                                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleEquipmentQuantityChange(item.id, 1)} disabled={(selectedEquipment[item.id] || 0) >= item.stock}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
           
           <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Reviews</CardTitle>
                     {facility.reviews && facility.reviews.length >= 3 && (
                        <Button variant="outline" size="sm" onClick={handleGenerateSummary} disabled={isSummaryLoading}>
                            {isSummaryLoading ? <LoadingSpinner size={16} className="mr-2"/> : <Sparkles className="mr-2 h-4 w-4" />}
                            {isSummaryLoading ? "Analyzing..." : "AI Summary"}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {reviewSummary && (
                    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">AI Review Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h5 className="font-semibold flex items-center text-green-500"><ThumbsUp className="mr-2 h-4 w-4"/> Pros</h5>
                                <ul className="list-disc list-inside text-sm mt-1">{reviewSummary.pros.map((pro, i) => <li key={`pro-${i}`}>{pro}</li>)}</ul>
                            </div>
                            <div>
                                <h5 className="font-semibold flex items-center text-destructive"><ThumbsDown className="mr-2 h-4 w-4"/> Cons</h5>
                                <ul className="list-disc list-inside text-sm mt-1">{reviewSummary.cons.map((con, i) => <li key={`con-${i}`}>{con}</li>)}</ul>
                            </div>
                        </div>
                    </div>
                )}
                {facility.reviews && facility.reviews.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {facility.reviews.map(review => <ReviewItem key={review.id} review={review} />)}
                    </div>
                ) : <p className="text-muted-foreground">No reviews yet.</p>}
            </CardContent>
           </Card>

        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle>Book Your Slot</CardTitle>
              <CardDescription>Select date, sport, and time to reserve.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus disabled={(date) => date < startOfDay(new Date())} /></PopoverContent>
                </Popover>
              </div>
               <div>
                  <Label>Sport</Label>
                  <Select onValueChange={(value) => setSelectedSport(facility.sports.find(s => s.id === value))} value={selectedSport?.id}>
                    <SelectTrigger><SelectValue placeholder="Select a sport" /></SelectTrigger>
                    <SelectContent>
                        {facility.sports.map(sport => <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
               </div>
               <div>
                 <Label>Time Slot</Label>
                 {isSlotsLoading ? (
                    <div className="flex items-center justify-center h-10 border rounded-md"><LoadingSpinner size={20}/></div>
                 ) : (
                    <Select onValueChange={(value) => setSelectedSlot(timeSlots.find(s => s.startTime === value))} value={selectedSlot?.startTime}>
                    <SelectTrigger><SelectValue placeholder="Select a time" /></SelectTrigger>
                    <SelectContent>
                        {timeSlots.map(slot => (
                        <SelectItem key={slot.startTime} value={slot.startTime} disabled={!slot.isAvailable}>
                            {slot.startTime} - {slot.endTime} {!slot.isAvailable && " (Booked)"}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                 )}
               </div>
               
               {dynamicPrice && siteSettings ? (
                    <div className="p-3 bg-muted rounded-md text-center">
                        <p className="text-sm text-muted-foreground">Total Price (incl. rentals):</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(dynamicPrice.finalPrice, siteSettings.defaultCurrency)}</p>
                    </div>
               ) : (
                   selectedSlot && <div className="p-3 text-center"><Skeleton className="h-12 w-32 mx-auto" /></div>
               )}
            </CardContent>
            

            <CardFooter className="flex-col gap-2 pt-6">
              <Button className="w-full" onClick={handleBooking} disabled={!selectedSlot || !selectedSport || isBooking}>
                {isBooking ? <LoadingSpinner size={20} className="mr-2" /> : <CalendarDays className="mr-2 h-4 w-4" />}
                {isBooking ? 'Processing...' : 'Book Now'}
              </Button>
              <Button className="w-full" variant="outline" onClick={handleFavoriteClick} disabled={isFavoriteLoading}>
                {isFavoriteLoading ? <LoadingSpinner size={20} className="mr-2"/> : <Heart className={cn("mr-2 h-4 w-4", isFavorited && "fill-destructive text-destructive")}/>}
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
