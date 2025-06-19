
'use client';

import { useState, useEffect } from 'react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { FacilitySearchForm } from '@/components/facilities/FacilitySearchForm';
import { FacilityMap } from '@/components/facilities/FacilityMap'; // Import the new map component
import { PageTitle } from '@/components/shared/PageTitle';
import type { Facility } from '@/lib/types';
import { mockFacilities } from '@/lib/data';
import { AlertCircle, LayoutGrid, Map } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';


export default function FacilitiesPage() {
  const [facilitiesToShow, setFacilitiesToShow] = useState<Facility[]>(mockFacilities);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid'); // Default to grid view

  useEffect(() => {
    const timer = setTimeout(() => {
      // Initialize with all facilities that have coordinates for map view
      const facilitiesWithCoords = mockFacilities.filter(f => f.latitude !== undefined && f.longitude !== undefined);
      setFacilitiesToShow(facilitiesWithCoords);
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
      // Filter out facilities without coordinates if map view might be active
      // or simply ensure all shown facilities have coordinates if that's a requirement for the list too.
      // For now, let's assume the list can show all, but map only shows those with coords.
      setFacilitiesToShow(facilities);
      setIsLoading(false);
    }, 300);
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

      <Tabs defaultValue="grid" value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'map')} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="grid"><LayoutGrid className="mr-2 h-4 w-4" /> Grid View</TabsTrigger>
          <TabsTrigger value="map"><Map className="mr-2 h-4 w-4" /> Map View</TabsTrigger>
        </TabsList>
      </Tabs>

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
