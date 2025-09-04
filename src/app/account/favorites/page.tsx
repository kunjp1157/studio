
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import type { Facility, SiteSettings, UserProfile } from '@/lib/types';
import { getFacilitiesByIds } from '@/lib/data';
import { getSiteSettingsAction } from '@/app/actions';
import { Heart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const CardSkeleton = () => (
  <div className="bg-card p-4 rounded-lg shadow-md">
    <Skeleton className="h-48 w-full rounded mb-4" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-2" />
    <Skeleton className="h-4 w-1/3" />
  </div>
);

export default function FavoritesPage() {
  const [favoriteFacilities, setFavoriteFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const activeUserStr = sessionStorage.getItem('activeUser');
    if (activeUserStr) {
        setCurrentUser(JSON.parse(activeUserStr));
    } else {
        // If no user is logged in, we can stop loading.
        setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) {
        setFavoriteFacilities([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const settings = await getSiteSettingsAction();
      setCurrency(settings.defaultCurrency);

      try {
        if (currentUser.favoriteFacilities && currentUser.favoriteFacilities.length > 0) {
          const favs = await getFacilitiesByIds(currentUser.favoriteFacilities);
          setFavoriteFacilities(favs);
        } else {
          setFavoriteFacilities([]);
        }
      } catch (error) {
        console.error("Failed to fetch favorite facilities:", error);
        setFavoriteFacilities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <PageTitle title="My Favorite Facilities" description="Your curated list of preferred sports venues." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 4 }).map((_, index) => (
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
            <Link href="/facilities">
              <Button className="mt-4">Browse Facilities</Button>
            </Link>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {favoriteFacilities.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} currency={currency}/>
          ))}
        </div>
      )}
    </div>
  );
}

    