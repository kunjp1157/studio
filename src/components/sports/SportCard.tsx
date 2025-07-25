
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Sport } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getIconComponent } from '@/components/shared/Icon';

interface SportCardProps {
  sport: Sport;
}

export function SportCard({ sport }: SportCardProps) {
  const SportIconComponent = getIconComponent(sport.iconName);

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg hover:-translate-y-2">
      <CardHeader className="p-0 relative">
        <Link href={`/facilities?sport=${sport.id}`} passHref>
          <div className="aspect-[4/3] w-full relative">
            <Image
              src={sport.imageUrl || `https://placehold.co/400x300.png?text=${encodeURIComponent(sport.name)}`}
              alt={sport.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint={sport.imageDataAiHint || sport.name.toLowerCase()}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center mb-2">
            {SportIconComponent && <SportIconComponent className="w-6 h-6 mr-2 text-primary" />}
            <CardTitle className="text-xl font-headline truncate">{sport.name}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          Find top-rated facilities and courts to play {sport.name.toLowerCase()} near you.
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/facilities?sport=${sport.id}`} className="w-full">
          <Button className="w-full" variant="default" aria-label={`Find ${sport.name} facilities`}>
            Find Venues <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
