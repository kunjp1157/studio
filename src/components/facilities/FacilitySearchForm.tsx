
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SearchFilters, Amenity as AmenityType, SiteSettings, Facility, Sport } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, MapPin, CalendarDays, Filter, Dices,LayoutPanelLeft, SunMoon, DollarSign, ListChecks, Clock, Building } from 'lucide-react';
import { getStaticSports, getStaticAmenities } from '@/lib/data';
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { formatCurrency } from '@/lib/utils';
import { getIconComponent } from '@/components/shared/Icon';


interface FacilitySearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  currency: SiteSettings['defaultCurrency'] | null;
  facilities: Facility[];
  cities: string[];
  locations: string[]; // All locations, will be filtered client-side
}

const ANY_SPORT_VALUE = "all-sports-filter-value";

export function FacilitySearchForm({ onSearch, currency, facilities, cities = [], locations: allLocations = [] }: FacilitySearchFormProps) {
  const searchParams = useSearchParams();
  const sportQueryParam = searchParams.get('sport');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState(sportQueryParam || ANY_SPORT_VALUE);
  const [selectedCity, setSelectedCity] = useState('all');
  const [location, setLocation] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  
  const [minPrice, maxPrice] = useMemo(() => {
    if (!facilities || facilities.length === 0) return [0, 100];
    const prices = facilities.flatMap(f => f.sportPrices?.map(p => p.price) || []);
    if (prices.length === 0) return [0, 100];
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [facilities]);

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [indoorOutdoor, setIndoorOutdoor] = useState<'any' | 'indoor' | 'outdoor'>('any');
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  const [filteredLocations, setFilteredLocations] = useState<string[]>(allLocations);
  
  const [mockSports, setMockSports] = useState<Sport[]>([]);
  const [mockAmenities, setMockAmenities] = useState<AmenityType[]>([]);

  useEffect(() => {
    const fetchSportsAndAmenities = () => {
        const sports = getStaticSports();
        setMockSports(sports);
        const amenities = getStaticAmenities(); 
        setMockAmenities(amenities);
    };
    fetchSportsAndAmenities();
  }, []);

  useEffect(() => {
      setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);
  
  useEffect(() => {
    if (sportQueryParam) {
      onSearch({ 
        searchTerm: '', 
        sport: sportQueryParam,
      });
    }
  }, [sportQueryParam, onSearch]);

  useEffect(() => {
    if (selectedCity === 'all') {
      setFilteredLocations(allLocations);
      setLocation('all'); // Reset location when city is reset
    } else {
      const locationsInCity = [...new Set(facilities.filter(f => f.city === selectedCity).map(f => f.location))];
      setFilteredLocations(locationsInCity);
      setLocation('all'); // Reset location filter when city changes
    }
  }, [selectedCity, facilities, allLocations]);


  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ 
      searchTerm, 
      sport: selectedSport === ANY_SPORT_VALUE ? '' : selectedSport, 
      city: selectedCity === 'all' ? undefined : selectedCity,
      location: location === 'all' ? undefined : location, 
      date: selectedDate,
      time: time,
      priceRange: priceRange[0] === minPrice && priceRange[1] === maxPrice ? undefined : priceRange, // Only pass if changed from default full range
      selectedAmenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      indoorOutdoor: indoorOutdoor === 'any' ? undefined : indoorOutdoor,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-card rounded-xl shadow-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <Label htmlFor="search-term" className="block text-sm font-medium text-foreground mb-1">
            Search Facility
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="search-term"
              type="text"
              placeholder="e.g., Grand Arena"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="city-filter" className="block text-sm font-medium text-foreground mb-1">
            City
          </Label>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <Building className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sport-type" className="block text-sm font-medium text-foreground mb-1">
            Sport Type
          </Label>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger>
              <Dices className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Any Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_SPORT_VALUE}>Any Sport</SelectItem>
              {mockSports.map((sport) => (
                <SelectItem key={sport.id} value={sport.id}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location-filter" className="block text-sm font-medium text-foreground mb-1">
            Area / Location
          </Label>
          <Select value={location} onValueChange={setLocation} disabled={selectedCity === 'all'}>
            <SelectTrigger id="location-filter">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Select a city first" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {filteredLocations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date" className="block text-sm font-medium text-foreground mb-1">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Collapsible open={isAdvancedFiltersOpen} onOpenChange={setIsAdvancedFiltersOpen}>
        <CollapsibleTrigger asChild>
            <Button variant="link" className="p-0 text-sm">
                <Filter className="mr-2 h-4 w-4" />
                {isAdvancedFiltersOpen ? "Hide" : "Show"} Advanced Filters
            </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                 <div>
                    <Label htmlFor="time-filter" className="block text-sm font-medium text-foreground mb-1">
                        Time (Requires Date)
                    </Label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="time-filter"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="pl-10"
                            disabled={!selectedDate}
                        />
                    </div>
                 </div>
                 <div>
                    <Label htmlFor="indoor-outdoor" className="block text-sm font-medium text-foreground mb-1">
                        Environment
                    </Label>
                    <Select value={indoorOutdoor} onValueChange={(value) => setIndoorOutdoor(value as 'any' | 'indoor' | 'outdoor')}>
                        <SelectTrigger>
                        <SunMoon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Any Environment" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="indoor">Indoor</SelectItem>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="price-range" className="block text-sm font-medium text-foreground mb-1">
                        Price Range ({currency ? `${formatCurrency(priceRange[0], currency)} - ${formatCurrency(priceRange[1], currency)}` : 'Loading...'})
                    </Label>
                    <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <Slider
                        id="price-range"
                        min={minPrice}
                        max={maxPrice}
                        step={1}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="my-2"
                        />
                    </div>
                </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-foreground mb-2">
                <ListChecks className="inline h-4 w-4 mr-2 text-muted-foreground" /> Specific Amenities
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 p-4 border rounded-md bg-muted/20">
                {mockAmenities.map((amenity) => {
                  const AmenityIcon = getIconComponent(amenity.iconName) || LayoutPanelLeft;
                  return (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity.id}`}
                        checked={selectedAmenities.includes(amenity.id)}
                        onCheckedChange={() => handleAmenityChange(amenity.id)}
                      />
                      <Label htmlFor={`amenity-${amenity.id}`} className="font-normal text-sm flex items-center">
                        <AmenityIcon className="mr-1.5 h-4 w-4 text-primary" />
                        {amenity.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="pt-2 flex justify-end">
        <Button type="submit" className="w-full md:w-auto">
          <Search className="mr-2 h-4 w-4" /> Apply Filters & Search
        </Button>
      </div>
    </form>
  );
}
