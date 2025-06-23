'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Facility } from '@/lib/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Fix for default marker icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


interface FacilityMapProps {
  facilities: Facility[];
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function FacilityMap({ facilities }: FacilityMapProps) {
  if (typeof window === 'undefined') {
    return null; // Don't render on the server
  }
  
  const facilitiesWithCoords = facilities.filter(f => f.latitude && f.longitude);

  let center: [number, number] = [34.0522, -118.2437]; // Default to Metropolis (LA)
  let zoom = 12;

  if (facilitiesWithCoords.length > 0) {
    const latitudes = facilitiesWithCoords.map(f => f.latitude!);
    const longitudes = facilitiesWithCoords.map(f => f.longitude!);
    center = [
      latitudes.reduce((a, b) => a + b, 0) / latitudes.length,
      longitudes.reduce((a, b) => a + b, 0) / longitudes.length,
    ];
    if (facilitiesWithCoords.length === 1) {
      zoom = 14;
    }
  }

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}>
       <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {facilitiesWithCoords.map(facility => (
        <Marker key={facility.id} position={[facility.latitude!, facility.longitude!]}>
          <Popup>
            <div className="font-semibold">{facility.name}</div>
            <p className="text-xs text-muted-foreground">{facility.address}</p>
            <Link href={`/facilities/${facility.id}`}>
              <Button size="sm" className="mt-2 w-full">View Details</Button>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
