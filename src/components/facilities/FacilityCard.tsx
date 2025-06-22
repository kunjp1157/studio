
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Facility, SiteSettings } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, DollarSign, Zap, Heart, MessageSquare, CalendarCheck2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StarDisplay } from '@/components/shared/StarDisplay';
import { cn } from '@/lib/utils';
import { getSiteSettings } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface FacilityCardProps {
  facility: Facility;
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const { toast } = useToast();
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  useEffect(() => {
    const settingsInterval = setInterval(() => {
        const currentSettings = getSiteSettings();
        setCurrency(prev => currentSettings.defaultCurrency !== prev ? currentSettings.defaultCurrency : prev);
    }, 3000);

    // Set initial value
    const currentSettings = getSiteSettings();
    setCurrency(currentSettings.defaultCurrency);


    return () => clearInterval(settingsInterval);
  }, []);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if the button is inside a Link
    e.stopPropagation();
    toast({
      title: "Added to Favorites (Mock)",
      description: `${facility.name} has been added to your favorites.`,
    });
    // In a real app, you'd update the user's favorite list here
  };

  const SportIcon = facility.sports[0]?.icon || Zap; // Default to Zap icon if no sport icon
  const reviewCount = facility.reviews?.length || 0;

  let availabilityStatus: { text: string; variant: "default" | "secondary" | "destructive" | "outline" } = {
    text: "Check Availability",
    variant: "outline",
  };

  if (facility.rating >= 4.5 && facility.isPopular) {
    availabilityStatus = { text: "High Demand", variant: "destructive" };
  } else if (facility.rating >= 4.0 || facility.isPopular) {
    availabilityStatus = { text: "Often Booked", variant: "secondary" };
  }


  return (
    <Card className={cn(
      "flex flex-col h-full overflow-hidden rounded-lg",
      "shadow-lg hover:shadow-2xl",
      "transition-all duration-300 ease-in-out hover:scale-[1.03]"
    )}>
      <CardHeader className="p-0 relative">
        <Link href={`/facilities/${facility.id}`}>
          <Image
            src={facility.images[0] || `https://placehold.co/400x250.png?text=${encodeURIComponent(facility.name)}`}
            alt={facility.name}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
            data-ai-hint={facility.dataAiHint || 'sports facility'}
          />
        </Link>
        {facility.isPopular && (
          <Badge variant="default" className="absolute top-2 left-2 bg-accent text-accent-foreground shadow-md">Popular</Badge>
        )}
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-9 w-9 bg-background/80 hover:bg-background rounded-full shadow-md"
            onClick={handleFavoriteClick}
            aria-label="Add to favorites"
        >
            <Heart className="h-5 w-5 text-destructive hover:fill-destructive/20" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-1.5 truncate">{facility.name}</CardTitle>
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
            <StarDisplay rating={facility.rating} starSize={16} />
            <span className="ml-1.5 text-muted-foreground">({facility.rating.toFixed(1)})</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MessageSquare className="w-4 h-4 mr-1" />
            <span>{reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="flex items-center text-base font-medium mb-3">
          <DollarSign className="w-4 h-4 mr-1 text-green-500" />
          <span>{currency ? formatCurrency(facility.pricePerHour, currency) : <Skeleton className="h-5 w-16 inline-block" />}</span>
          <span className='ml-1'>/hr</span>
        </div>

        <div className="flex items-center text-xs">
           <CalendarCheck2 className="w-3.5 h-3.5 mr-1.5 text-primary" />
           <Badge variant={availabilityStatus.variant} className="py-0.5 px-1.5">
            {availabilityStatus.text}
          </Badge>
        </div>

      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Link href={`/facilities/${facility.id}`} className="w-full">
          <Button className="w-full" variant="default" aria-label={`View details for ${facility.name}`}>
            View Details & Book
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
