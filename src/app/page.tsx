'use client';

import { useState, useEffect } from 'react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { FacilitySearchForm } from '@/components/facilities/FacilitySearchForm';
import { PageTitle } from '@/components/shared/PageTitle';
import type { Facility } from '@/lib/types';
import { mockFacilities } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function HomePage() {
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>(mockFacilities);
  const [isLoading, setIsLoading] = useState(true); // Simulate initial loading

  useEffect(() => {
    // Simulate API call or data fetching
    const timer = setTimeout(() => {
      setFilteredFacilities(mockFacilities);
      setIsLoading(false);
    }, 500); // Short delay for demo
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (filters: { searchTerm: string; sport: string; location: string; date?: Date }) => {
    setIsLoading(true);
    // Simulate filtering delay
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
      // Date filtering would be more complex, involving checking availability for that date.
      // For this mock, we'll skip date-based filtering of the facility list itself.
      // It would typically apply to slot availability within a facility.

      setFilteredFacilities(facilities);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle 
        title="Find Your Perfect Sports Facility"
        description="Search, discover, and book sports venues across the city."
        className="text-center mb-12"
      />

      <div className="mb-12">
        <FacilitySearchForm onSearch={handleSearch} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-card p-4 rounded-lg shadow-md animate-pulse">
              <div className="h-48 bg-muted rounded mb-4"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
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
        <Link href="/recommendation" passHref>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Get AI Recommendation
          </Button>
        </Link>
      </div>
    </div>
  );
}
