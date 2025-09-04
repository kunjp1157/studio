
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { SportEvent, Facility, Sport } from '@/lib/types';
import { getAllEventsAction, getFacilityByIdAction, getAllSportsAction } from '@/app/actions';
import { CalendarDays, MapPin, Users, Ticket, AlertCircle, Trophy, Zap, FilterX, ListFilter, Dices, SortAsc } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { format, parseISO, isSameDay, isPast } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getIconComponent } from '@/components/shared/Icon';

type SortOption = 'date-asc' | 'date-desc' | 'name-asc';

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<SportEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SportEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');
  const [allSports, setAllSports] = useState<Sport[]>([]);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const [eventsData, sportsData] = await Promise.all([
        getAllEventsAction(),
        getAllSportsAction()
    ]);
    setAllEvents(eventsData);
    setFilteredEvents(eventsData.sort((a,b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()));
    setAllSports(sportsData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
    window.addEventListener('dataChanged', fetchEvents);
    return () => window.removeEventListener('dataChanged', fetchEvents);
  }, [fetchEvents]);


  useEffect(() => {
    let eventsToDisplay = [...allEvents];

    if (sportFilter !== 'all') {
      eventsToDisplay = eventsToDisplay.filter(event => event.sport.id === sportFilter);
    }

    if (dateFilter) {
      eventsToDisplay = eventsToDisplay.filter(event => isSameDay(parseISO(event.startDate), dateFilter));
    }

    switch (sortOption) {
      case 'date-asc':
        eventsToDisplay.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case 'date-desc':
        eventsToDisplay.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
      case 'name-asc':
        eventsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    setFilteredEvents(eventsToDisplay);
  }, [allEvents, sportFilter, dateFilter, sortOption]);

  const clearFilters = () => {
    setSportFilter('all');
    setDateFilter(undefined);
  };

  if (isLoading && allEvents.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <PageTitle title="Upcoming Sports Events" description="Join exciting tournaments, leagues, and sports activities happening in the city." />
         <div className="flex justify-center items-center min-h-[300px]">
            <LoadingSpinner size={48}/>
         </div>
      </div>
    );
  }

  const EventCard = ({ event }: { event: SportEvent }) => {
    const [facility, setFacility] = useState<Facility | null>(null);
    const SportIcon = getIconComponent(event.sport.iconName) || Zap;
    const isEventPast = isPast(new Date(event.endDate));
    const isEventFull = event.maxParticipants && event.registeredParticipants >= event.maxParticipants;
    
    useEffect(() => {
        const fetchFacility = async () => {
            const fac = await getFacilityByIdAction(event.facilityId);
            setFacility(fac || null);
        };
        fetchFacility();
    }, [event.facilityId]);

    return (
      <Card key={event.id} className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-lg">
        <CardHeader className="p-4 relative">
             <Badge 
                variant={isEventPast ? "secondary" : (isEventFull ? "destructive" : "default")}
                className={`absolute top-2 right-2 ${!isEventPast && !isEventFull ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
            >
              {isEventPast ? "Concluded" : (isEventFull ? "Full" : "Open")}
            </Badge>
             <div className="flex items-center mb-2">
                <SportIcon className="h-6 w-6 text-primary mr-2 shrink-0" />
                <Link href={`/events/${event.id}`}>
                    <CardTitle className="text-xl font-headline truncate hover:text-primary" title={event.name}>{event.name}</CardTitle>
                </Link>
            </div>
            <CardDescription className="text-sm">{event.sport.name} Event</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-primary shrink-0" />
                <span>{format(new Date(event.startDate), 'MMM d, yyyy, p')}</span>
            </div>
            {facility && (
                <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary shrink-0" />
                <span>{facility.name}, {facility.location}</span>
                </div>
            )}
            <p className="text-foreground line-clamp-2 pt-1">{event.description}</p>
            <div className="flex items-center pt-1">
                <Users className="w-4 h-4 mr-2 text-primary shrink-0" />
                <span>
                {event.registeredParticipants} Registered
                {event.maxParticipants && ` / ${event.maxParticipants} Spots`}
                </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          <Link href={`/events/${event.id}`} className="w-full">
            <Button className="w-full">
                <Ticket className="mr-2 h-4 w-4" /> 
                View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Upcoming Sports Events" description="Join exciting tournaments, leagues, and sports activities happening in the city." />

      <Card className="my-8 p-4 md:p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="sport-filter" className="block text-sm font-medium text-muted-foreground mb-1">Filter by Sport</label>
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger id="sport-filter">
                <Dices className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {allSports.map(sport => (
                  <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-muted-foreground mb-1">Filter by Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date-filter" variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
           <div>
            <label htmlFor="sort-events" className="block text-sm font-medium text-muted-foreground mb-1">Sort By</label>
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
              <SelectTrigger id="sort-events">
                <SortAsc className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-asc">Date: Soonest</SelectItem>
                <SelectItem value="date-desc">Date: Latest</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={clearFilters} variant="outline" className="w-full" disabled={sportFilter === 'all' && !dateFilter}>
            <FilterX className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        </div>
      </Card>

      {isLoading && allEvents.length > 0 ? (
        <div className="flex justify-center items-center min-h-[200px]"><LoadingSpinner size={36}/></div>
      ) : filteredEvents.length === 0 ? (
         <Alert className="mt-8">
            <Trophy className="h-4 w-4" />
            <AlertTitle>No Events Found</AlertTitle>
            <AlertDescription>
            No events match your current filters. Try adjusting your search criteria or check back later!
            </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  );
}
