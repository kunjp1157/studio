
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
      <CardContent className="p-6 flex-grow flex flex-col items-center text-center justify-center">
        {SportIconComponent && <SportIconComponent className="w-16 h-16 mb-4 text-primary" />}
        <CardTitle className="text-2xl font-headline truncate">{sport.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
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
