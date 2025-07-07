
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import type { SportEvent } from '@/lib/types';
import { deleteEvent, getFacilityById } from '@/lib/data';
import { getAllEventsAction } from '@/app/actions';
import { PlusCircle, MoreHorizontal, Edit, Trash2, CalendarDays as EventIcon, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { format, parseISO } from 'date-fns';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<SportEvent | null>(null);
  const { toast } = useToast();

  const fetchAndSetData = async () => {
    try {
      const freshEvents = await getAllEventsAction();
      setEvents(freshEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast({
        title: "Error",
        description: "Could not load events data.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAndSetData().finally(() => setIsLoading(false));
    // The polling interval can be removed if you prefer to rely on manual refreshes
    // or more advanced real-time listeners (which can be implemented later).
    const intervalId = setInterval(fetchAndSetData, 5000); 
    return () => clearInterval(intervalId);
  }, []);

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await deleteEvent(eventToDelete.id);
      toast({
        title: "Event Deleted",
        description: `"${eventToDelete.name}" has been successfully deleted.`,
      });
      // Immediately update local state for a faster UI response
      setEvents(prevEvents => prevEvents.filter(e => e.id !== eventToDelete.id));
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete "${eventToDelete.name}".`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setEventToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <PageTitle title="Manage Events" description="Add, edit, or remove sports events and tournaments." />
          <Button disabled><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
        </div>
        <div className="border rounded-lg p-4">
          <div className="h-96 flex items-center justify-center">
            <LoadingSpinner size={48} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <PageTitle title="Manage Events" description="Add, edit, or remove sports events and tournaments." />
        <Link href="/admin/events/new">
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Event</Button>
        </Link>
      </div>

      <div className="border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Facility</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell><Badge variant="outline">{event.sport.name}</Badge></TableCell>
                  <TableCell>{event.facilityName || 'N/A'}</TableCell>
                  <TableCell>
                    {format(parseISO(event.startDate), 'MMM d, yy')} - {format(parseISO(event.endDate), 'MMM d, yy')}
                  </TableCell>
                  <TableCell>
                    {event.registeredParticipants} / {event.maxParticipants || '∞'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/events/${event.id}`}><Eye className="mr-2 h-4 w-4" /> View Public Page</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/events/${event.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => setEventToDelete(event)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {eventToDelete && (
        <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the event "{eventToDelete.name}"
                and all its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEventToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteEvent} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                {isDeleting ? <LoadingSpinner size={16} className="mr-2" /> : <Trash2 className="mr-2 h-4 w-4" />}
                {isDeleting ? 'Deleting...' : 'Yes, delete event'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
