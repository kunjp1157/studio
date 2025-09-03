
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Facility, SearchFilters, SiteSettings } from '@/lib/types';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { FacilitySearchForm } from '@/components/facilities/FacilitySearchForm';
import { PageTitle } from '@/components/shared/PageTitle';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getStaticFacilities, getSiteSettings } from '@/lib/data';

export default function FacilitiesPage() {
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchInitialData = useCallback(() => {
    setIsLoading(true);
    try {
        const facilitiesData = getStaticFacilities();
        const settingsData = getSiteSettings();

        setAllFacilities(facilitiesData);
        setFilteredFacilities(facilitiesData);
        setCurrency(settingsData.defaultCurrency);
        setCities([...new Set(facilitiesData.map(f => f.city))]);
        setLocations([...new Set(facilitiesData.map(f => f.location))]);
    } catch (error) {
        toast({ title: 'Error', description: 'Could not fetch facilities data.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSearch = useCallback((filters: SearchFilters) => {
    let results = allFacilities;

    if (filters.searchTerm) {
      results = results.filter(f =>
        f.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        f.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    if (filters.sport) {
      results = results.filter(f => f.sports.some(s => s.id === filters.sport));
    }
    if (filters.city) {
        results = results.filter(f => f.city === filters.city);
    }
    if (filters.location) {
      results = results.filter(f => f.location === filters.location);
    }
    if (filters.priceRange) {
      results = results.filter(f => {
        if (!f.sportPrices || f.sportPrices.length === 0) return false;
        const minPrice = Math.min(...f.sportPrices.map(p => p.price));
        return minPrice >= filters.priceRange![0] && minPrice <= filters.priceRange![1];
      });
    }
    if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
      results = results.filter(f => 
        filters.selectedAmenities!.every(amenityId => f.amenities.some(a => a.id === amenityId))
      );
    }
    if (filters.indoorOutdoor) {
        if(filters.indoorOutdoor === 'indoor') {
            results = results.filter(f => f.isIndoor);
        } else if (filters.indoorOutdoor === 'outdoor') {
            results = results.filter(f => !f.isIndoor);
        }
    }

    setFilteredFacilities(results);
  }, [allFacilities]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Find a Facility" description="Search, filter, and book your next game." />
      <FacilitySearchForm onSearch={handleSearch} currency={currency} facilities={allFacilities} cities={cities} locations={locations} />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={48} />
        </div>
      ) : (
        <div className="mt-8">
          {filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFacilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} currency={currency}/>
              ))}
            </div>
          ) : (
             <Alert className="mt-8">
              <Search className="h-4 w-4" />
              <AlertTitle>No Facilities Found</AlertTitle>
              <AlertDescription>
                We couldn't find any facilities matching your criteria. Try adjusting your filters.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
