
'use client';

import type { Facility } from '@/lib/types';
import { MapPin, Info } from 'lucide-react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FacilityMapProps {
  facilities: Facility[];
  mapHeight?: string;
  mapWidth?: string;
}

// These are arbitrary min/max values for scaling mock coordinates
// In a real app, these would be derived from the actual geographic bounds of facilities
const MOCK_MIN_LAT = 34.0300;
const MOCK_MAX_LAT = 34.0700;
const MOCK_MIN_LON = -118.2700;
const MOCK_MAX_LON = -118.2200;

export function FacilityMap({ facilities, mapHeight = '400px', mapWidth = '100%' }: FacilityMapProps) {
  if (!facilities || facilities.length === 0) {
    return (
      <Card style={{ width: mapWidth, height: mapHeight }} className="flex items-center justify-center bg-muted/50 border-dashed">
        <div className="text-center text-muted-foreground">
          <MapPin className="mx-auto h-12 w-12 mb-2" />
          <p>No facilities to display on the map.</p>
          <p className="text-xs">Try adjusting your search filters.</p>
        </div>
      </Card>
    );
  }

  const scaleCoordinate = (value: number, minVal: number, maxVal: number, dimensionMax: number = 100) => {
    // Ensure value is within bounds to prevent extreme scaling
    const clampedValue = Math.max(minVal, Math.min(value, maxVal));
    if (maxVal === minVal) return dimensionMax / 2; // Avoid division by zero
    return ((clampedValue - minVal) / (maxVal - minVal)) * dimensionMax;
  };


  return (
    <Card className="shadow-lg overflow-hidden">
        <CardHeader>
            <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary"/> Facility Map</CardTitle>
            <CardDescription>Visual representation of facility locations. Click markers for details.</CardDescription>
        </CardHeader>
        <CardContent>
            <div
            className="relative bg-muted/30 border rounded-md"
            style={{ width: mapWidth, height: mapHeight,  }}
            role="application"
            aria-label="Map of facilities"
            >
            {/* Background pattern to suggest a map */}
            <svg width="100%" height="100%" className="absolute inset-0 opacity-20">
                <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/>
                </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {facilities.map((facility) => {
                if (facility.latitude === undefined || facility.longitude === undefined) {
                return null; // Skip facilities without coordinates
                }

                // Scale coordinates to fit within the 0-100% range for top/left positioning
                // Note: Standard latitude increases North, longitude increases East.
                // For screen 'top' increases South, 'left' increases East. So latitude needs inversion.
                const topPercent = 100 - scaleCoordinate(facility.latitude, MOCK_MIN_LAT, MOCK_MAX_LAT);
                const leftPercent = scaleCoordinate(facility.longitude, MOCK_MIN_LON, MOCK_MAX_LON);

                return (
                <Popover key={facility.id}>
                    <PopoverTrigger asChild>
                    <button
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{
                        top: `${topPercent}%`,
                        left: `${leftPercent}%`,
                        }}
                        aria-label={`View details for ${facility.name}`}
                    >
                        <MapPin className="h-6 w-6 text-primary fill-primary/30 hover:fill-primary/50 transition-colors" />
                    </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 z-10" sideOffset={5}>
                    <div className="space-y-2">
                        <h4 className="font-semibold leading-none text-base">{facility.name}</h4>
                        <p className="text-sm text-muted-foreground">{facility.type}</p>
                        <p className="text-xs text-muted-foreground">{facility.address}</p>
                        <Link href={`/facilities/${facility.id}`}>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                            <Info className="mr-2 h-4 w-4" /> View Details
                        </Button>
                        </Link>
                    </div>
                    </PopoverContent>
                </Popover>
                );
            })}
            </div>
             <p className="text-xs text-muted-foreground mt-2 text-center">Note: This is a simplified visual representation. Coordinates are illustrative.</p>
        </CardContent>
    </Card>
  );
}
