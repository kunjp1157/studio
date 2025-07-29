

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SearchFilters, Amenity as AmenityType, SiteSettings, Facility } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, MapPin, CalendarDays, Filter, Dices,LayoutPanelLeft, SunMoon, DollarSign, ListChecks, Clock, Building, ArrowRight, Star, Wand2, Swords, Sparkles, Trophy } from 'lucide-react';
import { getMockSports, mockAmenities } from '@/lib/mock-data'; 
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { formatCurrency } from '@/lib/utils';
import { getIconComponent } from '@/components/shared/Icon';
import Link from 'next/link';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { getFacilitiesAction, getSiteSettingsAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { IconComponent } from '@/components/shared/Icon';
import { cn } from '@/lib/utils';
import { AlertCircle, SortAsc } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { PageTitle } from '@/components/shared/PageTitle';
import { FacilitySearchForm } from '@/components/facilities/FacilitySearchForm';

const CardSkeleton = () => (
    <div className="bg-card p-4 rounded-lg shadow-md">
        <Skeleton className="h-48 w-full rounded mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
    </div>
);


type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

export default function FacilitiesPage() {
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [facilitiesToShow, setFacilitiesToShow] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const { toast } = useToast();

  const cities = useMemo(() => {
      if (allFacilities.length === 0) return [];
      return [...new Set(allFacilities.map(f => f.city))].sort();
  }, [allFacilities]);
  
  const locations = useMemo(() => {
    if (allFacilities.length === 0) return [];
    return [...new Set(allFacilities.map(f => f.location))].sort();
  }, [allFacilities]);

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const [facilitiesData, settingsData] = await Promise.all([
                getFacilitiesAction(),
                getSiteSettingsAction()
            ]);
            
            setCurrency(settingsData.defaultCurrency);
            setAllFacilities(facilitiesData);
        } catch (error) {
            toast({
              title: "Error",
              description: "Could not load facilities data.",
              variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }
    fetchInitialData();
  }, [toast]);

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
      if (filters.indoorOutdoor) {
        facilitiesToProcess = facilitiesToProcess.filter(f => {
          if (filters.indoorOutdoor === 'indoor') return f.isIndoor === true;
          if (filters.indoorOutdoor === 'outdoor') return f.isIndoor === false;
          return true;
        });
      }
      if (filters.priceRange) {
        facilitiesToProcess = facilitiesToProcess.filter(f => 
          f.sportPrices.some(p => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1])
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
    }

    const sorted = sortFacilities(facilitiesToProcess, sortOption);
    setFacilitiesToShow(sorted);

  }, [allFacilities, currentFilters, sortOption]);

  const sortFacilities = (facilities: Facility[], option: SortOption): Facility[] => {
    let sorted = [...facilities];
    switch (option) {
      case 'price-asc':
        sorted.sort((a, b) => Math.min(...(a.sportPrices?.map(p => p.price) || [Infinity])) - Math.min(...(b.sportPrices?.map(p => p.price) || [Infinity])));
        break;
      case 'price-desc':
        sorted.sort((a, b) => Math.min(...(b.sportPrices?.map(p => p.price) || [Infinity])) - Math.min(...(a.sportPrices?.map(p => p.price) || [Infinity])));
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
        description="Browse our comprehensive list of sports venues available in Pune."
      />

      <div className="mb-8">
        <FacilitySearchForm 
          onSearch={handleSearch} 
          currency={currency} 
          facilities={allFacilities}
          cities={cities} 
          locations={locations} 
        />
      </div>

      <div className="flex justify-end items-center mb-6 gap-4">
        {/* Sort Dropdown */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {facilitiesToShow.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 [perspective:1000px]">
              {facilitiesToShow.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} currency={currency} />
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
