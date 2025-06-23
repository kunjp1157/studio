
'use client';

import { useState, useEffect, useMemo } from 'react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { FacilitySearchForm } from '@/components/facilities/FacilitySearchForm';
import { PageTitle } from '@/components/shared/PageTitle';
import type { Facility, SearchFilters } from '@/lib/types';
import { getAllFacilities } from '@/lib/data';
import { AlertCircle, SortAsc } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

export default function FacilitiesPage() {
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [facilitiesToShow, setFacilitiesToShow] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

  useEffect(() => {
    const fetchAndSetFacilities = () => {
      const freshFacilities = getAllFacilities();
      setAllFacilities(currentFacilities => {
        if (JSON.stringify(currentFacilities) !== JSON.stringify(freshFacilities)) {
          return freshFacilities;
        }
        return currentFacilities;
      });
    };

    // Initial fetch
    fetchAndSetFacilities();
    setIsLoading(false);

    // Set up polling to check for live updates every 3 seconds
    const intervalId = setInterval(fetchAndSetFacilities, 3000);

    // Cleanup on component unmount
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
      if (filters.location) {
        facilitiesToProcess = facilitiesToProcess.filter(f => f.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.indoorOutdoor) {
        facilitiesToProcess = facilitiesToProcess.filter(f => {
          if (filters.indoorOutdoor === 'indoor') return f.isIndoor === true;
          if (filters.indoorOutdoor === 'outdoor') return f.isIndoor === false;
          return true;
        });
      }
      if (filters.priceRange) {
        facilitiesToProcess = facilitiesToProcess.filter(f => 
          f.pricePerHour >= filters.priceRange![0] && f.pricePerHour <= filters.priceRange![1]
        );
      }
      if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
        facilitiesToProcess = facilitiesToProcess.filter(f => 
          filters.selectedAmenities!.every(saId => f.amenities.some(fa => fa.id === saId))
        );
      }
    }

    const sorted = sortFacilities(facilitiesToProcess, sortOption);
    setFacilitiesToShow(sorted);

  }, [allFacilities, currentFilters, sortOption]);

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
        sorted.sort((a,b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || a.name.localeCompare(b.name));
        break;
    }
    return sorted;
  };

  const handleSearch = (filters: SearchFilters) => {
    setCurrentFilters(filters);
  };
  
  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
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
    