'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Search, MapPin, CalendarDays, Filter, Dices } from 'lucide-react';
import { mockSports } from '@/lib/data'; // For sport options
import { format } from 'date-fns';

interface FacilitySearchFormProps {
  onSearch: (filters: { searchTerm: string; sport: string; location: string; date?: Date }) => void;
}

export function FacilitySearchForm({ onSearch }: FacilitySearchFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ searchTerm, sport: selectedSport, location, date: selectedDate });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-card rounded-xl shadow-lg space-y-4 md:space-y-0 md:flex md:items-end md:space-x-4">
      <div className="flex-grow">
        <label htmlFor="search-term" className="block text-sm font-medium text-foreground mb-1">
          Search Facility
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="search-term"
            type="text"
            placeholder="e.g., Grand Arena, Soccer field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <label htmlFor="sport-type" className="block text-sm font-medium text-foreground mb-1">
          Sport Type
        </label>
        <Select value={selectedSport} onValueChange={setSelectedSport}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Dices className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Any Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Sport</SelectItem>
            {mockSports.map((sport) => (
              <SelectItem key={sport.id} value={sport.id}>
                {sport.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
          Location
        </label>
         <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="location"
            type="text"
            placeholder="e.g., Metropolis"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 w-full md:w-[180px]"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-foreground mb-1">
          Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[180px] justify-start text-left font-normal"
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
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90">
        <Filter className="mr-2 h-4 w-4" /> Search
      </Button>
    </form>
  );
}
