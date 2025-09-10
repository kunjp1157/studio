

'use client';

import { useState, useEffect, useCallback } from 'react';
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
import type { Facility, SiteSettings, FacilityStatus } from '@/lib/types';
import { getFacilitiesAction, getSiteSettingsAction, deleteFacilityAction, updateFacilityAction, addNotificationAction } from '@/app/actions';
import { PlusCircle, MoreHorizontal, Edit, Trash2, Eye, Building2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null);
  const { toast } = useToast();
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  const fetchFacilitiesData = async () => {
    setIsLoading(true);
    try {
        const [facilitiesData, settingsData] = await Promise.all([
            getFacilitiesAction(),
            getSiteSettingsAction()
        ]);
        setFacilities(facilitiesData.sort((a,b) => (a.status === 'PendingApproval' ? -1 : 1) - (b.status === 'PendingApproval' ? -1 : 1) || new Date(b.id.split('-').pop()!).getTime() - new Date(a.id.split('-').pop()!).getTime()));
        setCurrency(settingsData.defaultCurrency);
    } catch (error) {
         toast({
          title: "Error",
          description: "Could not load facilities data.",
          variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilitiesData();
    window.addEventListener('dataChanged', fetchFacilitiesData);
    return () => window.removeEventListener('dataChanged', fetchFacilitiesData);
  }, [toast]);

  const handleDeleteFacility = async () => {
    if (!facilityToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFacilityAction(facilityToDelete.id);
      toast({
        title: "Facility Deleted",
        description: `"${facilityToDelete.name}" and all its associated bookings, events, and reviews have been removed.`,
      });
      fetchFacilitiesData();
    } catch (error) {
       toast({
        title: "Error Deleting Facility",
        description: `Could not delete "${facilityToDelete.name}". An unknown error occurred.`,
        variant: "destructive",
      });
    } finally {
        setIsDeleting(false);
        setFacilityToDelete(null);
    }
  };
  
  const handleStatusUpdate = async (facility: Facility, newStatus: FacilityStatus) => {
    try {
        const updatedFacility = await updateFacilityAction({ ...facility, id: facility.id, status: newStatus });
        if (updatedFacility.ownerId) {
            await addNotificationAction(updatedFacility.ownerId, {
                type: 'facility_approved',
                title: `Facility ${newStatus}`,
                message: `Your facility "${facility.name}" has been ${newStatus === 'Active' ? 'approved' : 'rejected'} by an admin.`,
                link: `/owner/my-facilities`,
            });
        }
        toast({
            title: `Facility ${newStatus}`,
            description: `"${facility.name}" has been ${newStatus === 'Active' ? 'approved' : 'rejected'}.`,
        });
        fetchFacilitiesData();
    } catch (error) {
         toast({ title: "Error", description: "Failed to update facility status.", variant: "destructive" });
    }
  };

  const getStatusBadgeVariant = (status: FacilityStatus) => {
      switch (status) {
          case 'Active': return 'default';
          case 'PendingApproval': return 'secondary';
          case 'Rejected': return 'destructive';
          case 'Inactive': return 'outline';
          default: return 'outline';
      }
  }
  
    const getPriceRange = (facility: Facility) => {
    if (!currency) return <Skeleton className="h-5 w-24" />;
    if (!facility.sportPrices || facility.sportPrices.length === 0) return 'N/A';
    
    const prices = facility.sportPrices.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return formatCurrency(minPrice, currency);
    }
    return `${formatCurrency(minPrice, currency)} - ${formatCurrency(maxPrice, currency)}`;
  }


  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageTitle title="Manage Facilities" description="Add, edit, or remove sports facilities." />
        <Card className="shadow-lg">
          <CardHeader>
             <CardTitle className="flex items-center"><Building2 className="mr-2 h-6 w-6 text-primary"/>Loading Facilities...</CardTitle>
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
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <CardTitle className="flex items-center"><Building2 className="mr-2 h-6 w-6 text-primary"/>Facility Management</CardTitle>
                <CardDescription>Add new facilities, edit details, or remove listings from the platform.</CardDescription>
            </div>
            <Link href="/admin/facilities/new">
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Facility</Button>
            </Link>
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {facilities.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No facilities found. Add one to get started!
                        </TableCell>
                    </TableRow>
                    ) : (
                    facilities.map((facility) => (
                        <TableRow key={facility.id} className={cn(facility.status === 'PendingApproval' && 'bg-yellow-500/10 hover:bg-yellow-500/20')}>
                        <TableCell className="font-medium">{facility.name}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(facility.status)} className={cn(
                              facility.status === 'Active' && 'bg-green-500/20 text-green-700 border-green-500/50',
                              facility.status === 'PendingApproval' && 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50',
                              facility.status === 'Rejected' && 'bg-red-500/20 text-red-700 border-red-500/50'
                          )}>
                              {facility.status === 'PendingApproval' ? 'Pending' : facility.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{facility.location}</TableCell>
                        <TableCell>
                           {facility.status === 'PendingApproval' ? (
                                <div className="flex gap-2 justify-start">
                                    <Button size="sm" variant="default" onClick={() => handleStatusUpdate(facility, 'Active')} className="bg-green-500 hover:bg-green-600">
                                        <CheckCircle className="mr-1 h-4 w-4"/> Approve
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(facility, 'Rejected')}>
                                        <XCircle className="mr-1 h-4 w-4"/> Reject
                                    </Button>
                                </div>
                           ) : (
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
                                      <Link href={`/facilities/${facility.id}`}><Eye className="mr-2 h-4 w-4" /> View Public Page</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/facilities/${facility.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                    onClick={() => setFacilityToDelete(facility)}
                                    >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                           )}
                        </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>


      {facilityToDelete && (
        <AlertDialog open={!!facilityToDelete} onOpenChange={(open) => !open && setFacilityToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the facility "{facilityToDelete.name}"
                and all its associated data, including bookings, events, and reviews.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setFacilityToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteFacility} 
                disabled={isDeleting} 
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isDeleting ? <LoadingSpinner size={16} className="mr-2" /> : <Trash2 className="mr-2 h-4 w-4" />}
                {isDeleting ? 'Deleting...' : 'Yes, delete facility'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
