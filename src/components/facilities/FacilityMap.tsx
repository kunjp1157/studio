
'use client';

import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import type { Facility } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface FacilityMapProps {
  facilities: Facility[];
  mapHeight?: string;
  mapWidth?: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

// A default center for the map, e.g., center of Metropolis
const defaultCenter = {
  lat: 34.0522,
  lng: -118.2437
};

export function FacilityMap({ facilities, mapHeight = '500px', mapWidth = '100%' }: FacilityMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const onMarkerClick = (facility: Facility) => {
    setSelectedFacility(facility);
  };

  const mapRef = React.useRef<google.maps.Map | null>(null);

  const onMapLoad = React.useCallback(function callback(map: google.maps.Map) {
    if (facilities.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      facilities.forEach(facility => {
        if (facility.latitude && facility.longitude) {
          bounds.extend(new window.google.maps.LatLng(facility.latitude, facility.longitude));
        }
      });
      map.fitBounds(bounds);

      // Add a listener to adjust zoom after fitting bounds to prevent over-zooming
      const listener = window.google.maps.event.addListener(map, 'idle', function() {
        if (map.getZoom()! > 15) map.setZoom(15);
        window.google.maps.event.removeListener(listener);
      });
    } else if (facilities.length === 1 && facilities[0].latitude && facilities[0].longitude) {
        map.setCenter({ lat: facilities[0].latitude, lng: facilities[0].longitude });
        map.setZoom(14);
    } else {
        map.setCenter(defaultCenter);
        map.setZoom(12);
    }
    mapRef.current = map;
  }, [facilities]);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    mapRef.current = null;
  }, []);

  if (loadError) {
    return (
        <Card style={{ width: mapWidth, height: mapHeight }} className="flex items-center justify-center bg-destructive/10 border-destructive">
            <div className="text-center text-destructive">
                <MapPin className="mx-auto h-12 w-12 mb-2" />
                <p>Error loading Google Maps.</p>
                <p className="text-xs">Please check your API key and internet connection.</p>
            </div>
        </Card>
    );
  }

  if (!isLoaded) {
    return (
        <Card style={{ width: mapWidth, height: mapHeight }} className="flex items-center justify-center bg-muted/50 border-dashed">
            <LoadingSpinner size={40} />
            <p className="ml-4 text-muted-foreground">Loading Map...</p>
        </Card>
    );
  }
  
  if (facilities.length === 0) {
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

  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary"/> Facility Map</CardTitle>
        <CardDescription>Visual representation of facility locations. Click markers for details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: mapHeight, width: mapWidth }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            onLoad={onMapLoad}
            onUnmount={onUnmount}
          >
            {facilities.map((facility) =>
              (facility.latitude && facility.longitude) && (
                <Marker
                  key={facility.id}
                  position={{ lat: facility.latitude, lng: facility.longitude }}
                  onClick={() => onMarkerClick(facility)}
                />
              )
            )}

            {selectedFacility && (
              <InfoWindow
                position={{ lat: selectedFacility.latitude!, lng: selectedFacility.longitude! }}
                onCloseClick={() => setSelectedFacility(null)}
              >
                <div className="space-y-1 p-1 max-w-xs">
                  <h4 className="font-semibold leading-none text-base">{selectedFacility.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedFacility.type}</p>
                  <p className="text-xs text-muted-foreground">{selectedFacility.address}</p>
                  <Link href={`/facilities/${selectedFacility.id}`} className="block">
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <Info className="mr-2 h-4 w-4" /> View Details
                    </Button>
                  </Link>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">Map data from Google Maps.</p>
      </CardContent>
    </Card>
  );
}
