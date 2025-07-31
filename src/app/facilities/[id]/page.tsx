
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useParams, useRouter, notFound } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { StarDisplay } from '@/components/shared/StarDisplay';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ReviewItem } from '@/components/reviews/ReviewItem';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO, startOfDay } from 'date-fns';
import {
  MapPin, CalendarDays, Clock, Users, SunMoon, DollarSign, Sparkles, AlertCircle, Heart,
  ThumbsUp, ThumbsDown
} from 'lucide-react';
import type { Facility, Amenity as AmenityType, Review, Sport, TimeSlot, SiteSettings, BlockedSlot, UserProfile } from '@/lib/types';
import { getFacilityByIdAction, getSiteSettingsAction, getBookingsForFacilityOnDate, calculateDynamicPrice, addBooking, addNotification, toggleFavoriteFacilityAction } from '@/lib/data';
import { getIconComponent } from '@/components/shared/Icon';
import { summarizeReviews, type SummarizeReviewsOutput } from '@/ai/flows/summarize-reviews';
import { Skeleton } from '@/components/ui/skeleton';

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
      if (foundFacility?.sports.length) {
        setSelectedSport(foundFacility.sports[0]);
      }
    }
  }, [facilityId]);

  useEffect(() => {
    fetchFacilityData();
    getSiteSettingsAction().then(setSiteSettings);
  }, [fetchFacilityData]);

  useEffect(() => {
      if(currentUser && facility) {
          setIsFavorited(currentUser.favoriteFacilities?.includes(facility.id) || false);
      }
  }, [currentUser, facility]);

  useEffect(() => {
    const fetchSlots = async () => {
        if (facility && selectedDate) {
            setIsSlotsLoading(true);
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            const bookingsOnDate = await getBookingsForFacilityOnDate(facility.id, formattedDate);
            const slots = generateTimeSlots(facility, selectedDate, bookingsOnDate);
            setTimeSlots(slots);
            setSelectedSlot(undefined);
            setIsSlotsLoading(false);
        }
    };
    fetchSlots();
  }, [facility, selectedDate]);
  
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

  const dynamicPrice = useMemo(() => {
    if (facility && selectedSport && selectedDate && selectedSlot) {
      const sportPriceInfo = facility.sportPrices.find(p => p.sportId === selectedSport.id);
      if (!sportPriceInfo) return null;
      return calculateDynamicPrice(sportPriceInfo.price, selectedDate, selectedSlot, 1);
    }
    return null;
  }, [facility, selectedSport, selectedDate, selectedSlot]);
  
  const handleBooking = () => {
    if (!facility || !selectedSport || !selectedDate || !selectedSlot || !dynamicPrice || !currentUser) {
        toast({ title: "Incomplete Selection", description: "Please select a sport, date, and available time slot.", variant: "destructive"});
        return;
    }

    const bookingData = {
      facilityId: facility.id,
      facilityName: facility.name,
      facilityImage: facility.images[0] || '',
      dataAiHint: facility.dataAiHint,
      sportId: selectedSport.id,
      sportName: selectedSport.name,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      totalPrice: dynamicPrice.finalPrice,
      status: 'Confirmed' as const,
      userId: currentUser.id,
    };
    
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
            <Image src={facility.images[0]} alt={facility.name} width={800} height={450} className="w-full h-auto object-cover" priority data-ai-hint={facility.dataAiHint || "sports facility detail"}/>
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
                        <p className="text-sm text-muted-foreground">Price for this slot:</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(dynamicPrice.finalPrice, siteSettings.defaultCurrency)}</p>
                    </div>
               ) : (
                   selectedSlot && <div className="p-3 text-center"><Skeleton className="h-12 w-32 mx-auto" /></div>
               )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
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
