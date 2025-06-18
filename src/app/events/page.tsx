'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SportEvent } from '@/lib/types';
import { mockEvents, getFacilityById } from '@/lib/data';
import { CalendarDays, MapPin, Users, Ticket, AlertCircle, Trophy } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { format, parseISO } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function EventsPage() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching events
    setTimeout(() => {
      setEvents(mockEvents.sort((a,b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()));
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <PageTitle title="Upcoming Sports Events" description="Join exciting tournaments, leagues, and sports activities happening in the city." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 3 }).map((_, index) => (
             <Card key={index} className="animate-pulse">
                <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
                <CardFooter>
                    <div className="h-10 bg-muted rounded w-full"></div>
                </CardFooter>
             </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Upcoming Sports Events" description="Join exciting tournaments, leagues, and sports activities happening in the city." />

      {events.length === 0 ? (
         <Alert className="mt-8">
            <Trophy className="h-4 w-4" />
            <AlertTitle>No Upcoming Events</AlertTitle>
            <AlertDescription>
            There are currently no events scheduled. Please check back later for new announcements!
            </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {events.map((event) => {
            const facility = getFacilityById(event.facilityId);
            const SportIcon = event.sport.icon || Trophy;
            return (
              <Card key={event.id} className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <SportIcon className="h-10 w-10 text-primary mb-2" />
                    <Badge variant={event.registeredParticipants < (event.maxParticipants || Infinity) ? "default" : "secondary"}
                           className={event.registeredParticipants < (event.maxParticipants || Infinity) ? "bg-accent text-accent-foreground" : ""}
                    >
                      {event.registeredParticipants < (event.maxParticipants || Infinity) ? "Open for Registration" : "Fully Booked"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-headline">{event.name}</CardTitle>
                  <CardDescription>{event.sport.name} Event</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarDays className="w-4 h-4 mr-2 text-primary" />
                    <span>{format(parseISO(event.startDate), 'MMM d, yyyy, p')} - {format(parseISO(event.endDate), 'MMM d, yyyy, p')}</span>
                  </div>
                  {facility && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      <span>{facility.name}, {facility.location}</span>
                    </div>
                  )}
                  <p className="text-foreground line-clamp-3">{event.description}</p>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    <span>
                      {event.registeredParticipants} Registered
                      {event.maxParticipants && ` / ${event.maxParticipants} Spots`}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled={event.registeredParticipants >= (event.maxParticipants || Infinity)}>
                    <Ticket className="mr-2 h-4 w-4" /> 
                    {event.registeredParticipants >= (event.maxParticipants || Infinity) ? "Event Full" : "Register / View Details"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
