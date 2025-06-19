
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Facility, Amenity, Sport, Review } from '@/lib/types';
import { getFacilityById } from '@/lib/data';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Clock, DollarSign, CalendarPlus, Users, Zap, Heart, MessageSquare } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { StarDisplay } from '@/components/shared/StarDisplay';
import { ReviewItem } from '@/components/reviews/ReviewItem';

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
  const { toast } = useToast();

  useEffect(() => {
    if (facilityId) {
      const foundFacility = getFacilityById(facilityId);
      setTimeout(() => {
        setFacility(foundFacility || null);
      }, 300);
    }
  }, [facilityId]);

  const handleFavoriteClick = () => {
    if (!facility) return;
    toast({
      title: "Added to Favorites (Mock)",
      description: `${facility.name} has been added to your favorites.`,
    });
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
          <AlertDescription>The facility you are looking for does not exist or could not be loaded.</AlertDescription>
        </Alert>
         <Link href="/facilities">
            <Button variant="outline" className="mt-4">Back to Facilities</Button>
          </Link>
      </div>
    );
  }
  
  const reviewCount = facility.reviews?.length || 0;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6 shadow-lg">
            <Image
              src={facility.images[0] || `https://placehold.co/800x450.png?text=${encodeURIComponent(facility.name)}`}
              alt={facility.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 hover:scale-105"
              data-ai-hint={facility.dataAiHint || 'sports facility large'}
            />
          </div>
          {facility.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              {facility.images.slice(1, 4).map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-md overflow-hidden shadow-md">
                  <Image src={img} alt={`${facility.name} - view ${idx + 2}`} layout="fill" objectFit="cover" data-ai-hint={facility.dataAiHint || 'sports detail'} />
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-start mb-2">
            <PageTitle title={facility.name} />
            <Button variant="outline" onClick={handleFavoriteClick} className="ml-4 mt-1 shrink-0">
              <Heart className="mr-2 h-4 w-4 text-destructive" /> Add to Favorites
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
              <DollarSign className="w-4 h-4 mr-1 text-green-500" /> {facility.pricePerHour}/hr
            </div>
          </div>


          <p className="text-lg text-foreground mb-6">{facility.description}</p>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="sports">Sports</TabsTrigger>
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
                    <p className="text-muted-foreground mb-4 flex items-center"><Users className="w-4 h-4 mr-2" /> Up to {facility.capacity} people</p>
                  </>
                  }
                  <p className="text-sm text-muted-foreground">Facility Type: <Badge variant="outline">{facility.type}</Badge></p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="amenities">
              <Card>
                <CardContent className="pt-6">
                  <ul className="grid grid-cols-2 gap-4">
                    {facility.amenities.map((amenity: Amenity) => {
                      const IconComponent = amenity.icon || Zap;
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
                    <CardContent className="pt-6">
                        <ul className="grid grid-cols-2 gap-4">
                            {facility.sports.map((sport: Sport) => {
                            const IconComponent = sport.icon || Zap;
                            return (
                                <li key={sport.id} className="flex items-center text-foreground">
                                <IconComponent className="w-5 h-5 mr-2 text-primary" />
                                {sport.name}
                                </li>
                            );
                            })}
                        </ul>
                    </CardContent>
                </Card>
            </TabsContent>
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
