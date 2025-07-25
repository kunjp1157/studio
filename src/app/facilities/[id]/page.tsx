
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Facility, Amenity, Sport, Review, RentalEquipment, SiteSettings } from '@/lib/types';
import { getFacilityByIdAction, getSiteSettingsAction } from '@/app/actions';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, MapPin, Clock, DollarSign, CalendarPlus, Users, Zap, Heart, MessageSquare, PackageSearch, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { StarDisplay } from '@/components/shared/StarDisplay';
import { ReviewItem } from '@/components/reviews/ReviewItem';
import { summarizeReviews, type SummarizeReviewsOutput } from '@/ai/flows/summarize-reviews';
import { Skeleton } from '@/components/ui/skeleton';
import { getIconComponent } from '@/components/shared/Icon';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Mock calendar component for availability preview
function AvailabilityPreview({ facilityId }: { facilityId: string }) {
  // In a real app, fetch and display actual availability
  const today = new Date();
  const nextThreeDays = Array.from({ length: 3 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {nextThreeDays.map(date => (
            <div key={date.toISOString()} className="flex justify-between items-center p-2 border rounded-md">
              <span>{date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <Badge variant={Math.random() > 0.3 ? "default" : "secondary"} className={Math.random() > 0.3 ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}>
                {Math.random() > 0.3 ? "Slots Available" : "Limited Slots"}
              </Badge>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Full availability shown during booking.</p>
      </CardContent>
    </Card>
  );
}


export default function FacilityDetailPage() {
  const params = useParams();
  const facilityId = params.id as string;
  const [facility, setFacility] = useState<Facility | null | undefined>(undefined); // undefined for loading, null for not found
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const { toast } = useToast();
  const [summary, setSummary] = useState<SummarizeReviewsOutput | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
        if (facilityId) {
            const foundFacility = await getFacilityByIdAction(facilityId);
            const settings = await getSiteSettingsAction();
            setTimeout(() => { // Simulate fetch delay
                setFacility(foundFacility || null);
                setCurrency(settings.defaultCurrency);
            }, 300);
        }
    };
    fetchInitialData();
  }, [facilityId]);

  useEffect(() => {
    if (facility && facility.reviews && facility.reviews.length >= 3) {
        const fetchSummary = async () => {
            setIsSummaryLoading(true);
            try {
                const reviewComments = facility.reviews!.map(r => r.comment).filter(Boolean);
                if (reviewComments.length > 0) {
                    const result = await summarizeReviews({ reviews: reviewComments });
                    setSummary(result);
                }
            } catch (error) {
                console.error("Failed to fetch review summary:", error);
                // Don't show a user-facing error for this, it's a non-critical feature.
            } finally {
                setIsSummaryLoading(false);
            }
        };
        fetchSummary();
    }
  }, [facility]);

  const handleFavoriteClick = () => {
    if (!facility) return;
    const newFavoritedState = !isFavorited;
    setIsFavorited(newFavoritedState);
    toast({
      title: newFavoritedState ? "Added to Favorites" : "Removed from Favorites",
      description: `${facility.name} has been ${newFavoritedState ? 'added to' : 'removed from'} your favorites.`,
    });
  };
  
  const renderPrice = (price: number) => {
    if (!currency) return <Skeleton className="h-5 w-20 inline-block" />;
    return formatCurrency(price, currency);
  };

  const AiSummarySkeleton = () => (
    <Card className="mb-6 animate-pulse bg-muted/30">
        <CardHeader>
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4 mt-1"></div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <div className="h-5 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-1"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
            <div>
                <div className="h-5 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
            </div>
        </CardContent>
    </Card>
  );

  const AiSummary = () => {
    if (!summary || (summary.pros.length === 0 && summary.cons.length === 0)) {
        return null;
    }
    
    return (
    <Card className="mb-6 bg-accent/10 border-accent/30">
        <CardHeader>
            <CardTitle className="flex items-center text-xl">
                <Sparkles className="mr-2 h-5 w-5 text-accent"/>
                AI Review Summary
            </CardTitle>
            <CardDescription>A quick overview based on recent user feedback.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
                <h4 className="font-semibold flex items-center mb-2 text-green-700 dark:text-green-500">
                    <ThumbsUp className="mr-2 h-4 w-4"/>
                    Pros
                </h4>
                {summary && summary.pros.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
                        {summary.pros.map((pro, i) => <li key={`pro-${i}`}>{pro}</li>)}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground italic">No specific pros mentioned frequently.</p>
                )}
            </div>
            <div>
                <h4 className="font-semibold flex items-center mb-2 text-red-700 dark:text-red-500">
                    <ThumbsDown className="mr-2 h-4 w-4"/>
                    Cons
                </h4>
                 {summary && summary.cons.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
                        {summary.cons.map((con, i) => <li key={`con-${i}`}>{con}</li>)}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground italic">No specific cons mentioned frequently.</p>
                )}
            </div>
        </CardContent>
    </Card>
  )};

  if (facility === undefined) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <div className="grid grid-cols-3 gap-2">
                        <Skeleton className="aspect-video w-full rounded-md" />
                        <Skeleton className="aspect-video w-full rounded-md" />
                        <Skeleton className="aspect-video w-full rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="md:col-span-1 space-y-6">
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
  }

  if (!facility) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Facility Not Found</AlertTitle>
          <AlertDescription>The facility you are looking for does not exist or could not be loaded.</AlertDescription>
        </Alert>
         <Link href="/facilities">
            <Button variant="outline" className="mt-4">Back to Facilities</Button>
          </Link>
      </div>
    );
  }
  
  const reviewCount = facility.reviews?.length || 0;
  const hasRentals = facility.availableEquipment && facility.availableEquipment.length > 0;
  const minPrice = facility.sportPrices.length > 0 ? Math.min(...facility.sportPrices.map(p => p.pricePerHour)) : 0;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6 shadow-lg">
            <Image
              src={facility.images[0] || `https://placehold.co/800x450.png?text=${encodeURIComponent(facility.name)}`}
              alt={facility.name}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
              data-ai-hint={facility.dataAiHint || 'sports facility large'}
            />
          </div>
          {facility.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              {facility.images.slice(1, 4).map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-md overflow-hidden shadow-md">
                  <Image src={img} alt={`${facility.name} - view ${idx + 2}`} fill sizes="(max-width: 768px) 30vw, 250px" objectFit="cover" data-ai-hint={facility.dataAiHint || 'sports detail'} />
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-start mb-2">
            <PageTitle title={facility.name} />
            <Button variant="outline" onClick={handleFavoriteClick} className="ml-4 mt-1 shrink-0 group">
              <Heart className={cn(
                  "mr-2 h-4 w-4 text-destructive transition-all duration-300 ease-in-out group-hover:scale-110",
                  isFavorited ? "fill-destructive" : "fill-transparent"
              )} />
              {isFavorited ? "Favorited" : "Favorite"}
            </Button>
          </div>
          
          <div className="flex items-center space-x-4 mb-2 text-muted-foreground">
            <div className="flex items-center">
              <StarDisplay rating={facility.rating} starSize={20} />
              <span className="font-medium ml-1.5 mr-1">{facility.rating.toFixed(1)}</span>
              <span className="text-sm">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
            </div>
          </div>
           <div className="flex items-center space-x-4 mb-4 text-muted-foreground text-sm">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-primary" /> {facility.location}
            </div>
            <div className="flex items-center">
              Starts from {renderPrice(minPrice)}/hr
            </div>
          </div>


          <p className="text-lg text-foreground mb-6">{facility.description}</p>
          
          {isSummaryLoading && <AiSummarySkeleton />}
          {!isSummaryLoading && <AiSummary />}


          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="sports">Sports</TabsTrigger>
              {hasRentals && <TabsTrigger value="rentals">Rentals</TabsTrigger>}
              <TabsTrigger value="hours">Hours</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Address</h3>
                  <p className="text-muted-foreground mb-4">{facility.address}</p>
                  {facility.capacity && <>
                    <h3 className="text-lg font-semibold mb-2">Capacity</h3>
                    <div className="text-muted-foreground mb-4 flex items-center"><Users className="w-4 h-4 mr-2" /> Up to {facility.capacity} people</div>
                  </>
                  }
                  <div className="text-sm text-muted-foreground">Facility Type: <Badge variant="outline">{facility.type}</Badge></div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="amenities">
              <Card>
                <CardContent className="pt-6">
                  <ul className="grid grid-cols-2 gap-4">
                    {facility.amenities.map((amenity: Amenity) => {
                      const IconComponent = getIconComponent(amenity.iconName) || Zap;
                      return (
                        <li key={amenity.id} className="flex items-center text-foreground">
                          <IconComponent className="w-5 h-5 mr-2 text-primary" />
                          {amenity.name}
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sports">
                <Card>
                    <CardHeader>
                        <CardTitle>Sports & Pricing</CardTitle>
                        <CardDescription>Hourly rates for different sports available at this facility.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {facility.sports.map((sport: Sport) => {
                              const sportPrice = facility.sportPrices.find(p => p.sportId === sport.id);
                              const IconComponent = getIconComponent(sport.iconName) || Zap;
                              return (
                                  <li key={sport.id} className="flex items-center justify-between text-foreground p-3 border rounded-md">
                                    <div className="flex items-center">
                                        <IconComponent className="w-5 h-5 mr-3 text-primary" />
                                        <span className="font-medium">{sport.name}</span>
                                    </div>
                                    <span className="font-semibold text-primary">
                                        {sportPrice ? renderPrice(sportPrice.pricePerHour) + '/hr' : 'N/A'}
                                    </span>
                                  </li>
                              );
                            })}
                        </ul>
                    </CardContent>
                </Card>
            </TabsContent>
             {hasRentals && (
              <TabsContent value="rentals">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Equipment Rentals</CardTitle>
                    <CardDescription>Rent equipment for your session directly during booking.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {facility.availableEquipment?.map((equip: RentalEquipment) => (
                        <Card key={equip.id} className="flex flex-col sm:flex-row items-center p-3 gap-3">
                          {equip.imageUrl && (
                            <Image 
                              src={equip.imageUrl} 
                              alt={equip.name} 
                              width={60} 
                              height={60} 
                              className="rounded-md object-cover h-16 w-16 sm:h-20 sm:w-20"
                              data-ai-hint={equip.dataAiHint || "sports equipment"}
                            />
                          )}
                          <div className="text-center sm:text-left">
                            <h4 className="font-semibold text-md">{equip.name}</h4>
                            <p className="text-sm text-muted-foreground">{renderPrice(equip.pricePerItem)} / {equip.priceType === 'per_booking' ? 'booking' : 'hour'}</p>
                            <p className="text-xs text-muted-foreground">Stock: {equip.stock}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            <TabsContent value="hours">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-1">
                    {facility.operatingHours.map(oh => (
                      <li key={oh.day} className="flex justify-between text-muted-foreground">
                        <span>{oh.day}:</span>
                        <span>{oh.open} - {oh.close}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                    <CardTitle>User Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviewCount > 0 ? (
                    facility.reviews?.map(review => (
                      <ReviewItem key={review.id} review={review} />
                    ))
                  ) : (
                    <p className="text-muted-foreground">No reviews yet for this facility. Be the first to write one!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>

        {/* Right Column: Booking Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Book Your Slot</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Select your preferred date and time to reserve this facility.
              </p>
              <AvailabilityPreview facilityId={facility.id}/>
              <Link href={`/facilities/${facility.id}/book`}>
                <Button size="lg" className="w-full mt-6">
                  <CalendarPlus className="mr-2 h-5 w-5" /> Book Now
                </Button>
              </Link>
            </CardContent>
          </Card>
           <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-headline">Facility Rules</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Proper sports attire required.</li>
                    <li>No food or drinks on courts/fields.</li>
                    <li>Bookings are non-refundable within 24 hours.</li>
                    <li>Respect staff and other users.</li>
                </ul>
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
