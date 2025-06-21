
'use client';

import { useState, useEffect } from 'react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { FacilitySearchForm } from '@/components/facilities/FacilitySearchForm';
import { PageTitle } from '@/components/shared/PageTitle';
import type { Facility, SearchFilters } from '@/lib/types';
import { mockFacilities } from '@/lib/data';
import { AlertCircle, SortAsc } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

export default function FacilitiesPage() {
  const [allFacilities, setAllFacilities] = useState<Facility[]>(mockFacilities);
  const [facilitiesToShow, setFacilitiesToShow] = useState<Facility[]>(mockFacilities);
  const [isLoading, setIsLoading] = useState(true);
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
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle 
        title="All Sports Facilities"
        description="Browse our comprehensive list of sports venues available in the city."
      />

      <div className="mb-8">
        <FacilitySearchForm onSearch={handleSearch} />
      </div>

      <div className="flex justify-end items-center mb-6 gap-4">
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
          {facilitiesToShow.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {facilitiesToShow.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          ) : (
            <Alert variant="default" className="mt-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Facilities Found</AlertTitle>
              <AlertDescription>
                No facilities match your current search criteria. Try adjusting your filters.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
