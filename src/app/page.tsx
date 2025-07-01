
'use client';

import { useState, useEffect, useMemo } from 'react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { FacilitySearchForm } from '@/components/facilities/FacilitySearchForm';
import { PageTitle } from '@/components/shared/PageTitle';
import type { Facility, SearchFilters, SiteSettings } from '@/lib/types';
import { getFacilitiesAction, getSiteSettingsAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';

const CardSkeleton = () => (
    <div className="bg-card p-4 rounded-lg shadow-md">
        <Skeleton className="h-48 w-full rounded mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
    </div>
);

export default function HomePage() {
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

  const cities = useMemo(() => {
    return [...new Set(allFacilities.map(f => f.city))].sort();
  }, [allFacilities]);
  
  const locations = useMemo(() => {
    return [...new Set(allFacilities.map(f => f.location))].sort();
  }, [allFacilities]);


  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const [freshFacilities, settings] = await Promise.all([
        getFacilitiesAction(),
        getSiteSettingsAction()
      ]);
      setAllFacilities(freshFacilities);
      setCurrency(settings.defaultCurrency);
      setIsLoading(false);
    };

    fetchInitialData();

    const intervalId = setInterval(async () => {
      const freshFacilities = await getFacilitiesAction();
      setAllFacilities(freshFacilities);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    let facilitiesToProcess = [...allFacilities];

    if (currentFilters) {
      const filters = currentFilters;
      if (filters.searchTerm) {
        facilitiesToProcess = facilitiesToProcess.filter(f => 
          f.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          f.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }
      if (filters.sport) {
        facilitiesToProcess = facilitiesToProcess.filter(f => f.sports.some(s => s.id === filters.sport));
      }
      if (filters.city) {
          facilitiesToProcess = facilitiesToProcess.filter(f => f.city === filters.city);
      }
      if (filters.location) {
        facilitiesToProcess = facilitiesToProcess.filter(f => f.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
       if (filters.priceRange) {
        facilitiesToProcess = facilitiesToProcess.filter(f => 
          f.sportPrices.some(p => p.pricePerHour >= filters.priceRange![0] && p.pricePerHour <= filters.priceRange![1])
        );
      }
      if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
        facilitiesToProcess = facilitiesToProcess.filter(f => 
          filters.selectedAmenities!.every(saId => f.amenities.some(fa => fa.id === saId))
        );
      }
      // Filter by operating time if both date and time are selected
      if (filters.date && filters.time) {
        const selectedDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][filters.date.getDay()] as 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
        facilitiesToProcess = facilitiesToProcess.filter(facility => {
            const operatingHoursForDay = facility.operatingHours.find(h => h.day === selectedDay);
            if (!operatingHoursForDay) {
                return false; // Facility is not open on this day
            }
            // Check if selected time is within the facility's open and close times
            return filters.time! >= operatingHoursForDay.open && filters.time! < operatingHoursForDay.close;
        });
      }
    } else {
        // On the homepage, we just show popular ones first by default if no filters are applied
        facilitiesToProcess.sort((a,b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
    
    setFilteredFacilities(facilitiesToProcess);
  }, [allFacilities, currentFilters]);

  const handleSearch = (filters: SearchFilters) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle 
        title="Find Your Perfect Sports Facility"
        description="Search, discover, and book sports venues across the city."
        className="text-center mb-12"
      />

      <div className="mb-12">
        <FacilitySearchForm onSearch={handleSearch} currency={currency} cities={cities} locations={locations}/>
      </div>

      {isLoading && filteredFacilities.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : filteredFacilities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFacilities.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      ) : (
        <Alert variant="default" className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Facilities Found</AlertTitle>
          <AlertDescription>
            No facilities match your current search criteria. Try adjusting your filters or broadening your search.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-12 text-center">
        <p className="text-lg text-muted-foreground mb-4">Can't decide? Let our AI help you!</p>
        <Link href="/recommendation">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Get AI Recommendation
          </Button>
        </Link>
      </div>
    </div>
  );
}
