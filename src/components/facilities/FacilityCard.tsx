
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Facility, SiteSettings, UserProfile } from '@/lib/types';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, MessageSquare, CalendarCheck2, Heart, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StarDisplay } from '@/components/shared/StarDisplay';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getIconComponent } from '@/components/shared/Icon';
import { toggleFavoriteFacilityAction } from '@/app/actions';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import Image from 'next/image';

interface FacilityCardProps {
  facility: Facility;
  currency: SiteSettings['defaultCurrency'] | null;
}

export function FacilityCard({ facility, currency }: FacilityCardProps) {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  useEffect(() => {
    const activeUserStr = sessionStorage.getItem('activeUser');
    if (activeUserStr) {
      const user = JSON.parse(activeUserStr);
      setCurrentUser(user);
      setIsFavorited(user.favoriteFacilities?.includes(facility.id) || false);
    }
  }, [facility.id]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      toast({ title: 'Please log in', description: 'You must be logged in to favorite facilities.', variant: 'destructive' });
      return;
    }

    setIsFavoriteLoading(true);
    const newFavoritedState = !isFavorited;
    
    try {
        const updatedUser = await toggleFavoriteFacilityAction(currentUser.id, facility.id);
        if (updatedUser) {
            setIsFavorited(newFavoritedState);
            // Update session storage to reflect the change immediately
            sessionStorage.setItem('activeUser', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('userChanged'));

            toast({
              title: newFavoritedState ? "Added to Favorites" : "Removed from Favorites",
              description: `${facility.name} has been ${newFavoritedState ? 'added to' : 'removed from'} your favorites.`,
            });
        }
    } catch (error) {
        toast({ title: 'Error', description: 'Could not update favorites.', variant: 'destructive' });
    } finally {
        setIsFavoriteLoading(false);
    }
  };

  const SportIcon = getIconComponent(facility.sports[0]?.iconName) || Zap;
  const reviewCount = facility.reviews?.length || 0;
  const ratingValue = typeof facility.rating === 'number' ? facility.rating : 0;


  let availabilityStatus: { text: string; variant: "default" | "secondary" | "destructive" | "outline" } = {
    text: "Check Availability",
    variant: "outline",
  };

  if (facility.rating >= 4.5 && facility.isPopular) {
    availabilityStatus = { text: "High Demand", variant: "destructive" };
  } else if (facility.rating >= 4.0 || facility.isPopular) {
    availabilityStatus = { text: "Often Booked", variant: "secondary" };
  }

  const minPrice = (facility.sportPrices && facility.sportPrices.length > 0)
    ? Math.min(...facility.sportPrices.map(p => p.price))
    : 0;

  return (
    <Card className={cn(
      "flex flex-col h-full overflow-hidden rounded-xl",
      "shadow-lg hover:shadow-2xl hover:shadow-primary/20",
      "transition-all duration-500 ease-in-out group preserve-3d",
      "bg-secondary/20 border-border/20 hover:border-primary/50"
    )}>
        <CardContent className="p-0 relative">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-background/70 p-1 backdrop-blur-sm transition-all duration-300 hover:bg-background/90 group-hover:scale-110"
                onClick={handleFavoriteClick}
                aria-label="Add to favorites"
                disabled={isFavoriteLoading}
            >
                {isFavoriteLoading ? <LoadingSpinner size={16} /> : <Heart className={cn(
                    "h-5 w-5 text-destructive transition-all duration-300 ease-in-out",
                    isFavorited ? "fill-destructive animate-pop" : "fill-transparent"
                )} />}
            </Button>
            <div className="aspect-video w-full overflow-hidden">
                <Image
                    src={facility.imageUrl || `https://picsum.photos/seed/${facility.id}/400/225`}
                    alt={facility.name}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={facility.dataAiHint || 'sports facility'}
                />
            </div>
        </CardContent>
        <div className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-headline mb-1.5 truncate pr-8">{facility.name}</CardTitle>
                <div className="flex flex-col items-end shrink-0">
                    {facility.isPopular && (
                        <Badge variant="default" className="mb-1 bg-primary text-primary-foreground shadow-md transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">Popular</Badge>
                    )}
                </div>
            </div>
        
            <div className="text-sm text-muted-foreground mb-1 flex items-center">
            <SportIcon className="w-4 h-4 mr-1.5 text-primary" />
            {facility.type} - {facility.sports.map(s => s.name).join(', ')}
            </div>
            <div className="text-sm text-muted-foreground mb-2.5 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-primary" />
            {facility.location}
            </div>

            <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center">
                <StarDisplay rating={ratingValue} starSize={16} />
                <span className="ml-1.5 text-muted-foreground">({ratingValue.toFixed(1)})</span>
            </div>
            <div className="flex items-center text-muted-foreground">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>{reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
            </div>
            </div>
            <div className="flex items-center text-base font-medium mb-3">
            <span>From {currency ? formatCurrency(minPrice, currency) : <Skeleton className="h-5 w-20 inline-block" />}</span>
            <span className='ml-1'>/hr</span>
            </div>
        </div>
      <CardFooter className="p-4 pt-2 mt-auto">
        <Link href={`/facilities/${facility.id}`} className="w-full">
          <Button className="w-full transition-transform duration-300" variant="default" aria-label={`View details for ${facility.name}`}>
            View Details & Book
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
