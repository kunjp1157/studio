
'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import type { SportEvent, UserProfile } from '@/lib/types';
import { getFacilitiesByOwnerIdAction, getEventsByFacilityIdsAction } from '@/app/actions';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getIconComponent } from '@/components/shared/Icon';
import Link from 'next/link';

export default function OwnerEventsPage() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
      setCurrentUser(JSON.parse(activeUser));
    }
  }, []);

  useEffect(() => {
    const fetchOwnerEvents = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const ownerFacilities = await getFacilitiesByOwnerIdAction(currentUser.id);
        const facilityIds = ownerFacilities.map(f => f.id);
        const ownerEvents = await getEventsByFacilityIdsAction(facilityIds);
        setEvents(ownerEvents.sort((a,b) => parseISO(b.startDate).getTime() - parseISO(a.startDate).getTime()));
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch events for your facilities.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwnerEvents();
  }, [currentUser, toast]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageTitle title="Your Facility Events" description="View all tournaments and events hosted at your venues." />
        <Card className="shadow-lg">
          <CardHeader><CardTitle>Loading Events...</CardTitle></CardHeader>
          <CardContent className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner size={36} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title="Your Facility Events" description="View all tournaments and events hosted at your venues." />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Event Schedule</CardTitle>
          <CardDescription>A list of all past, present, and future events at your facilities.</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No events are scheduled at your facilities.</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Participants</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => {
                    const SportIcon = getIconComponent(event.sport.iconName);
                    return (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Link href={`/events/${event.id}`} className="font-medium hover:underline flex items-center gap-2">
                             {SportIcon && <SportIcon className="h-4 w-4 text-primary" />}
                             {event.name}
                          </Link>
                        </TableCell>
                        <TableCell>{event.facilityName}</TableCell>
                        <TableCell>{format(parseISO(event.startDate), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            <Users className="mr-1.5 h-3 w-3" />
                            {event.registeredParticipants} / {event.maxParticipants || '∞'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
