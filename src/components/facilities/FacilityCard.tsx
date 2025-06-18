
import Image from 'next/image';
import Link from 'next/link';
import type { Facility } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, DollarSign, Zap } from 'lucide-react';

interface FacilityCardProps {
  facility: Facility;
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const SportIcon = facility.sports[0]?.icon || Zap; // Default to Zap icon if no sport icon

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0 relative">
        <Image
          src={facility.images[0] || `https://placehold.co/400x250.png?text=${encodeURIComponent(facility.name)}`}
          alt={facility.name}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
          data-ai-hint={facility.dataAiHint || 'sports facility'}
        />
        {facility.isPopular && (
          <Badge variant="destructive" className="absolute top-2 right-2 bg-accent text-accent-foreground">Popular</Badge>
        )}
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
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">{facility.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-green-500" />
            <span className="font-medium">{facility.pricePerHour}/hr</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/facilities/${facility.id}`}>
          <Button className="w-full" variant="default" aria-label={`View details for ${facility.name}`}>
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
