'use client';

import { useState, useEffect } from 'react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { FacilitySearchForm } from '@/components/facilities/FacilitySearchForm';
import { PageTitle } from '@/components/shared/PageTitle';
import type { Facility } from '@/lib/types';
import { mockFacilities } from '@/lib/data';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FacilitiesPage() {
  const [facilitiesToShow, setFacilitiesToShow] = useState<Facility[]>(mockFacilities);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFacilitiesToShow(mockFacilities);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (filters: { searchTerm: string; sport: string; location: string; date?: Date }) => {
    setIsLoading(true);
    setTimeout(() => {
      let facilities = mockFacilities;
      if (filters.searchTerm) {
        facilities = facilities.filter(f => 
          f.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          f.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }
      if (filters.sport) {
        facilities = facilities.filter(f => f.sports.some(s => s.id === filters.sport));
      }
      if (filters.location) {
        facilities = facilities.filter(f => f.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      setFacilitiesToShow(facilities);
      setIsLoading(false);
    }, 300);
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

      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {Array.from({ length: 6 }).map((_, index) => (
           <div key={index} className="bg-card p-4 rounded-lg shadow-md animate-pulse">
             <div className="h-48 bg-muted rounded mb-4"></div>
             <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
             <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
             <div className="h-4 bg-muted rounded w-1/3"></div>
           </div>
         ))}
       </div>
      ) : facilitiesToShow.length > 0 ? (
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
    </div>
  );
}
