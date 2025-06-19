
'use client';

import { useState, useEffect } from 'react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { FacilitySearchForm } from '@/components/facilities/FacilitySearchForm';
import { FacilityMap } from '@/components/facilities/FacilityMap';
import { PageTitle } from '@/components/shared/PageTitle';
import type { Facility, SearchFilters } from '@/lib/types';
import { mockFacilities } from '@/lib/data';
import { AlertCircle, LayoutGrid, Map, SortAsc, Star } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

export default function FacilitiesPage() {
  const [allFacilities, setAllFacilities] = useState<Facility[]>(mockFacilities);
  const [facilitiesToShow, setFacilitiesToShow] = useState<Facility[]>(mockFacilities);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('default');

  useEffect(() => {
    const timer = setTimeout(() => {
      // Initialize with all facilities
      setFacilitiesToShow(sortFacilities(mockFacilities, 'default'));
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const sortFacilities = (facilities: Facility[], option: SortOption): Facility[] => {
    let sorted = [...facilities];
    switch (option) {
      case 'price-asc':
        sorted.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'default':
      default:
        // No specific sort, or could be based on popularity or some default order
        // For now, let's keep original mock order or sort by popularity then name
        sorted.sort((a,b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || a.name.localeCompare(b.name));
        break;
    }
    return sorted;
  };


  const handleSearch = (filters: SearchFilters) => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered = [...allFacilities];

      if (filters.searchTerm) {
        filtered = filtered.filter(f => 
          f.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          f.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }
      if (filters.sport) {
        filtered = filtered.filter(f => f.sports.some(s => s.id === filters.sport));
      }
      if (filters.location) {
        filtered = filtered.filter(f => f.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      // Date filtering is complex for this mock and usually applies to specific slot availability.
      
      if (filters.indoorOutdoor) {
        filtered = filtered.filter(f => {
            if (filters.indoorOutdoor === 'indoor') return f.isIndoor === true;
            if (filters.indoorOutdoor === 'outdoor') return f.isIndoor === false;
            return true;
        });
      }

      if (filters.priceRange) {
        filtered = filtered.filter(f => 
            f.pricePerHour >= filters.priceRange![0] && f.pricePerHour <= filters.priceRange![1]
        );
      }

      if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
        filtered = filtered.filter(f => 
            filters.selectedAmenities!.every(saId => f.amenities.some(fa => fa.id === saId))
        );
      }
      
      setFacilitiesToShow(sortFacilities(filtered, sortOption));
      setIsLoading(false);
    }, 300);
  };
  
  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
    setIsLoading(true);
    // Re-sort the currently displayed (potentially filtered) facilities
    setFacilitiesToShow(prevFacilities => sortFacilities([...prevFacilities], newSortOption));
    setIsLoading(false);
  };
  
  const facilitiesForMap = facilitiesToShow.filter(f => f.latitude !== undefined && f.longitude !== undefined);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle 
        title="All Sports Facilities"
        description="Browse our comprehensive list of sports venues available in the city."
      />

      <div className="mb-8">
        <FacilitySearchForm onSearch={handleSearch} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Tabs defaultValue="grid" value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'map')}>
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="grid"><LayoutGrid className="mr-2 h-4 w-4" /> Grid View</TabsTrigger>
            <TabsTrigger value="map"><Map className="mr-2 h-4 w-4" /> Map View</TabsTrigger>
            </TabsList>
        </Tabs>
        <div className="w-full sm:w-auto">
            <Select value={sortOption} onValueChange={(value) => handleSortChange(value as SortOption)}>
                <SelectTrigger className="w-full sm:w-[220px]">
                    <SortAsc className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>


      {isLoading ? (
         <div className="flex justify-center items-center h-96">
            <LoadingSpinner size={48} />
            <p className="ml-4 text-muted-foreground">Loading facilities...</p>
         </div>
      ) : (
        <>
          {viewMode === 'map' && (
            <div className="mb-8">
              <FacilityMap facilities={facilitiesForMap} mapHeight="500px" />
            </div>
          )}
          {viewMode === 'grid' && facilitiesToShow.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {facilitiesToShow.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          )}
          {facilitiesToShow.length === 0 && !isLoading && (
            <Alert variant="default" className="mt-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Facilities Found</AlertTitle>
              <AlertDescription>
                No facilities match your current search criteria. Try adjusting your filters.
              </AlertDescription>
            </Alert>
          )}
           {viewMode === 'map' && facilitiesForMap.length === 0 && !isLoading && (
             <Alert variant="default" className="mt-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Facilities with Location Data</AlertTitle>
              <AlertDescription>
                No facilities matching your current search have location data to display on the map.
              </AlertDescription>
            </Alert>
           )}
        </>
      )}
    </div>
  );
}
