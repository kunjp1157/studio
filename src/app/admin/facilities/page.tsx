
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
import type { Facility, SiteSettings } from '@/lib/types';
import { deleteFacility as deleteMockFacility } from '@/lib/data';
import { getFacilitiesAction, getSiteSettingsAction } from '@/app/actions';
import { PlusCircle, MoreHorizontal, Edit, Trash2, Eye, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null);
  const { toast } = useToast();
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  useEffect(() => {
    const fetchAndSetData = async () => {
      const freshFacilities = await getFacilitiesAction();
      setFacilities(currentFacilities => {
          if (JSON.stringify(currentFacilities) !== JSON.stringify(freshFacilities)) {
              return freshFacilities;
          }
          return currentFacilities;
      });
      const currentSettings = await getSiteSettingsAction();
      setCurrency(prev => currentSettings.defaultCurrency !== prev ? currentSettings.defaultCurrency : prev);
    };

    fetchAndSetData().finally(() => setIsLoading(false));

    const intervalId = setInterval(fetchAndSetData, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDeleteFacility = () => {
    if (!facilityToDelete) return;
    setIsDeleting(true);
    setTimeout(() => {
      const success = deleteMockFacility(facilityToDelete.id);
      if (success) {
        setFacilities(prevFacilities => prevFacilities.filter(f => f.id !== facilityToDelete.id));
        toast({
          title: "Facility Deleted",
          description: `"${facilityToDelete.name}" and its future bookings have been removed.`,
        });
      } else {
         toast({
          title: "Error Deleting Facility",
          description: `Could not delete "${facilityToDelete.name}". It may have upcoming events associated with it. Please cancel the events first.`,
          variant: "destructive",
        });
      }
      setIsDeleting(false);
      setFacilityToDelete(null);
    }, 1000);
  };

  const getPriceRange = (facility: Facility) => {
    if (!currency) return <Skeleton className="h-5 w-24" />;
    if (facility.sportPrices.length === 0) return 'N/A';
    
    const prices = facility.sportPrices.map(p => p.pricePerHour);
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
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price/hr</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {facilities.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No facilities found. Add one to get started!
                        </TableCell>
                    </TableRow>
                    ) : (
                    facilities.map((facility) => (
                        <TableRow key={facility.id}>
                        <TableCell className="font-medium">{facility.name}</TableCell>
                        <TableCell><Badge variant="outline">{facility.type}</Badge></TableCell>
                        <TableCell>{facility.location}</TableCell>
                        <TableCell>{getPriceRange(facility)}</TableCell>
                        <TableCell className="text-center">{facility.rating.toFixed(1)}</TableCell>
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
                and all its associated data, including reviews and potentially bookings.
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
