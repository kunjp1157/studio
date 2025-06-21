
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import type { Facility } from '@/lib/types';

interface FacilityMapProps {
  facilities: Facility[];
  mapHeight?: string;
  mapWidth?: string;
}

export function FacilityMap({ facilities, mapHeight = '500px', mapWidth = '100%' }: FacilityMapProps) {

  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary"/> Facility Map</CardTitle>
        <CardDescription>A visual overview of facility locations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: mapHeight, width: mapWidth }} className="relative bg-muted flex items-center justify-center rounded-lg">
          <Image
            src="https://placehold.co/1200x500.png"
            alt="Map of facilities"
            fill
            sizes="1200px"
            className="object-cover opacity-30"
            data-ai-hint="map abstract"
          />
          <div className="z-10 text-center">
            <MapPin className="mx-auto h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold text-muted-foreground">Interactive Map Coming Soon</p>
            <p className="mt-1 text-sm text-muted-foreground">Please use the grid view to browse facilities.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
