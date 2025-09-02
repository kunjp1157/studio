
'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from 'lucide-react';
import { getAllBookingsAction, getFacilitiesByOwnerIdAction } from '@/app/actions';
import type { Booking, Facility, UserProfile } from '@/lib/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

   useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
        setCurrentUser(JSON.parse(activeUser));
    }
     const handleUserChange = () => {
        const updatedUser = sessionStorage.getItem('activeUser');
        if(updatedUser) {
            setCurrentUser(JSON.parse(updatedUser));
        }
    };
    window.addEventListener('userChanged', handleUserChange);
    return () => window.removeEventListener('userChanged', handleUserChange);
  }, []);

  const fetchBookings = useCallback(async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
          const [ownerFacilities, allBookings] = await Promise.all([
              getFacilitiesByOwnerIdAction(currentUser.id),
              getAllBookingsAction()
          ]);
          const facilityIds = ownerFacilities.map(f => f.id);
          const ownerBookings = allBookings
              .filter(b => facilityIds.includes(b.facilityId))
              .sort((a,b) => parseISO(b.bookedAt).getTime() - parseISO(a.bookedAt).getTime());
          
          setBookings(ownerBookings);
      } catch (error) {
          toast({
              title: "Error",
              description: "Could not load bookings for your facilities.",
              variant: "destructive"
          });
      } finally {
          setIsLoading(false);
      }
  }, [currentUser, toast]);

  useEffect(() => {
    if (currentUser) {
        fetchBookings();
    }
    
    // Listen for the global dataChanged event to refetch data
    window.addEventListener('dataChanged', fetchBookings);
    return () => {
        window.removeEventListener('dataChanged', fetchBookings);
    };
  }, [currentUser, fetchBookings]);


  return (
    <div className="space-y-8">
      <PageTitle title="Your Facility Bookings" description="View and manage bookings made for your facilities in real-time." />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ticket className="mr-2 h-6 w-6 text-primary" />
            Live Bookings Overview
          </CardTitle>
          <CardDescription>
            This table shows all bookings made for your facilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <LoadingSpinner size={36} />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No bookings found for your facilities yet.</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Booked At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.facilityName}</TableCell>
                      <TableCell>{booking.sportName}</TableCell>
                      <TableCell>
                        {format(parseISO(booking.date), 'MMM d, yyyy')} at {booking.startTime}
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.status === 'Confirmed' ? 'default' : (booking.status === 'Cancelled' ? 'destructive' : 'secondary')}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(parseISO(booking.bookedAt), 'MMM d, p')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
