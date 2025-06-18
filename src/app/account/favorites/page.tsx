
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import type { Facility } from '@/lib/types';
import { mockUser, mockFacilities, getFacilityById } from '@/lib/data';
import { AlertCircle, Heart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function FavoritesPage() {
  const [favoriteFacilities, setFavoriteFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user's favorite facilities
    setTimeout(() => {
      if (mockUser.favoriteFacilities) {
        const favs = mockUser.favoriteFacilities
          .map(favId => getFacilityById(favId))
          .filter(Boolean) as Facility[];
        setFavoriteFacilities(favs);
      }
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <PageTitle title="My Favorite Facilities" description="Your curated list of preferred sports venues." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 3 }).map((_, index) => (
             <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="My Favorite Facilities" description="Your curated list of preferred sports venues." />

      {favoriteFacilities.length === 0 ? (
        <Alert className="mt-8">
          <Heart className="h-4 w-4" />
          <AlertTitle>No Favorites Yet!</AlertTitle>
          <AlertDescription>
            You haven't added any facilities to your favorites. Start exploring and save the ones you love!
            <Link href="/facilities" passHref>
              <Button className="mt-4">Browse Facilities</Button>
            </Link>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {favoriteFacilities.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      )}
    </div>
  );
}

// Simple skeleton for loading state
const CardSkeleton = () => (
  <div className="bg-card p-4 rounded-lg shadow-md animate-pulse">
    <div className="h-48 bg-muted rounded mb-4"></div>
    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-muted rounded w-1/3"></div>
  </div>
);
