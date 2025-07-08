
'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Construction } from 'lucide-react';
import { listenToOwnerBookings, mockUser } from '@/lib/data';
import type { Booking } from '@/lib/types';
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

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ownerId = mockUser.id;

  useEffect(() => {
    if (!ownerId) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = listenToOwnerBookings(
      ownerId,
      (ownerBookings) => {
        setBookings(ownerBookings.sort((a, b) => parseISO(b.bookedAt).getTime() - parseISO(a.bookedAt).getTime()));
        setIsLoading(false);
      },
      (error) => {
        console.error("Error listening to owner bookings:", error);
        setIsLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [ownerId]);

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
            This table updates instantly as new bookings are made for your facilities.
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
