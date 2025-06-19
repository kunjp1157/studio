
import Image from 'next/image';
import Link from 'next/link';
import type { Facility } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, DollarSign, Zap, Heart, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StarDisplay } from '@/components/shared/StarDisplay'; // Added import

interface FacilityCardProps {
  facility: Facility;
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const SportIcon = facility.sports[0]?.icon || Zap; // Default to Zap icon if no sport icon
  const { toast } = useToast();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if the button is inside a Link
    e.stopPropagation();
    toast({
      title: "Added to Favorites (Mock)",
      description: `${facility.name} has been added to your favorites.`,
    });
    // In a real app, you'd update the user's favorite list here
  };

  const reviewCount = facility.reviews?.length || 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
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
          <Badge variant="destructive" className="absolute top-2 right-2 bg-accent text-accent-foreground">Popular</Badge>
        )}
        <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-1 right-10 h-8 w-8 bg-background/70 hover:bg-background rounded-full"
            onClick={handleFavoriteClick}
            aria-label="Add to favorites"
        >
            <Heart className="h-5 w-5 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-2 truncate">{facility.name}</CardTitle>
        <div className="text-sm text-muted-foreground mb-1 flex items-center">
          <SportIcon className="w-4 h-4 mr-1.5 text-primary" />
          {facility.type} - {facility.sports.map(s => s.name).join(', ')}
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex items-center">
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
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1 text-green-500" />
          <span className="font-medium">{facility.pricePerHour}/hr</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/facilities/${facility.id}`} className="w-full">
          <Button className="w-full" variant="default" aria-label={`View details for ${facility.name}`}>
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
