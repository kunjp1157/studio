
'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Booking, UserProfile, Facility } from '@/lib/types';
import { getAllBookings, getUserById, getFacilityById, mockUser } from '@/lib/data';
import { PlusCircle, MoreHorizontal, Eye, Edit, XCircle, DollarSign, Search, FilterX, User, Home, CalendarDays, Clock, Ticket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


export default function AdminBookingsPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Booking['status']>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching all bookings
    setTimeout(() => {
      const bookingsData = getAllBookings();
      setAllBookings(bookingsData);
      setFilteredBookings(bookingsData);
      setIsLoading(false);
    }, 700);
  }, []);

  useEffect(() => {
    let results = allBookings;

    if (searchTerm) {
      results = results.filter(booking => {
        const user = getUserById(booking.userId);
        const facility = getFacilityById(booking.facilityId);
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          booking.id.toLowerCase().includes(lowerSearchTerm) ||
          (user && user.name.toLowerCase().includes(lowerSearchTerm)) ||
          (user && user.email.toLowerCase().includes(lowerSearchTerm)) ||
          (facility && facility.name.toLowerCase().includes(lowerSearchTerm))
        );
      });
    }

    if (statusFilter !== 'all') {
      results = results.filter(booking => booking.status === statusFilter);
    }
    
    setFilteredBookings(results);
  }, [searchTerm, statusFilter, allBookings]);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };
  
  const getStatusBadgeVariant = (status: Booking['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Confirmed': return 'default'; // Typically green or primary
      case 'Pending': return 'secondary'; // Typically yellow or muted
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageTitle title="All Bookings" description="View and manage all bookings made on the platform." />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Loading Bookings...</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px]">
            <LoadingSpinner size={48} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title="All Bookings" description="View and manage all bookings made on the platform." />

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center"><Ticket className="mr-2 h-6 w-6 text-primary" />Booking Management</CardTitle>
            <CardDescription>Filter, view details, and manage platform reservations.</CardDescription>
          </div>
          <Button onClick={() => toast({ title: 'Feature Coming Soon', description: 'Manual booking creation will be available soon.'})}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Booking
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by Booking ID, User, Facility..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Booking['status'] | 'all')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button 
                variant="outline" 
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                disabled={!searchTerm && statusFilter === 'all'}
                className="w-full lg:w-auto"
            >
                <FilterX className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No bookings match your current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => {
                    const user = getUserById(booking.userId);
                    const facility = getFacilityById(booking.facilityId);
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">{booking.id.substring(0, 8)}...</TableCell>
                        <TableCell>{user?.name || `User ID: ${booking.userId.substring(0,6)}...`}</TableCell>
                        <TableCell>{facility?.name || booking.facilityName}</TableCell>
                        <TableCell>
                          {format(parseISO(booking.date), 'MMM d, yyyy')}
                          <br />
                          <span className="text-xs text-muted-foreground">{booking.startTime} - {booking.endTime}</span>
                        </TableCell>
                        <TableCell className="text-right">${booking.totalPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getStatusBadgeVariant(booking.status)} className={booking.status === 'Confirmed' ? 'bg-green-500 text-white hover:bg-green-600' : ''}>
                            {booking.status}
                          </Badge>
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
                              <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast({ title: 'Feature Coming Soon', description: 'Booking modification will be available soon.'})}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Booking
                              </DropdownMenuItem>
                              {booking.status !== 'Cancelled' && (
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => toast({ title: 'Feature Coming Soon', description: 'Booking cancellation will be available soon.'})}>
                                  <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => toast({ title: 'Feature Coming Soon', description: 'Refund processing will be available soon.'})}>
                                <DollarSign className="mr-2 h-4 w-4" /> Process Refund
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedBooking && (
        <AlertDialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center"><Ticket className="mr-2 h-6 w-6 text-primary" />Booking Details: {selectedBooking.id.substring(0,13)}</AlertDialogTitle>
              <AlertDialogDescription>
                Full information for this reservation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-semibold mb-1 flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>User Information</h4>
                        <p><strong>Name:</strong> {getUserById(selectedBooking.userId)?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {getUserById(selectedBooking.userId)?.email || 'N/A'}</p>
                        <p><strong>User ID:</strong> {selectedBooking.userId}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1 flex items-center"><Home className="mr-2 h-4 w-4 text-muted-foreground"/>Facility Information</h4>
                        <p><strong>Name:</strong> {getFacilityById(selectedBooking.facilityId)?.name || selectedBooking.facilityName}</p>
                        <p><strong>Type:</strong> {getFacilityById(selectedBooking.facilityId)?.type || 'N/A'}</p>
                        <p><strong>Facility ID:</strong> {selectedBooking.facilityId}</p>
                    </div>
                </div>
                <hr/>
                 <div>
                    <h4 className="font-semibold mb-1 flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>Booking Timing</h4>
                    <p><strong>Date:</strong> {format(parseISO(selectedBooking.date), 'EEEE, MMM d, yyyy')}</p>
                    <p><strong>Time:</strong> {selectedBooking.startTime} - {selectedBooking.endTime}</p>
                    <p><strong>Booked At:</strong> {format(parseISO(selectedBooking.bookedAt), 'MMM d, yyyy, p')}</p>
                 </div>
                 <hr/>
                <div>
                    <h4 className="font-semibold mb-1 flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground"/>Financials & Status</h4>
                    <p><strong>Total Price:</strong> ${selectedBooking.totalPrice.toFixed(2)}</p>
                    <p className="flex items-center"><strong>Status:</strong>
                        <Badge variant={getStatusBadgeVariant(selectedBooking.status)} className={`ml-2 ${selectedBooking.status === 'Confirmed' ? 'bg-green-500 text-white' : ''}`}>
                            {selectedBooking.status}
                        </Badge>
                    </p>
                    <p><strong>Reviewed:</strong> {selectedBooking.reviewed ? 'Yes' : 'No'}</p>
                </div>

            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDetailsModalOpen(false)}>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
