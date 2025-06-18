
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
import type { Facility } from '@/lib/types';
import { mockFacilities } from '@/lib/data';
import { PlusCircle, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching facilities
    setTimeout(() => {
      setFacilities(mockFacilities);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleDeleteFacility = () => {
    if (!facilityToDelete) return;
    setIsDeleting(true);
    // Simulate API call for deletion
    setTimeout(() => {
      setFacilities(prevFacilities => prevFacilities.filter(f => f.id !== facilityToDelete.id));
      toast({
        title: "Facility Deleted",
        description: `${facilityToDelete.name} has been successfully deleted.`,
      });
      setIsDeleting(false);
      setFacilityToDelete(null);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <PageTitle title="Manage Facilities" description="Add, edit, or remove sports facilities." />
          <Button disabled><PlusCircle className="mr-2 h-4 w-4" /> Add Facility</Button>
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
        <PageTitle title="Manage Facilities" description="Add, edit, or remove sports facilities." />
        <Link href="/admin/facilities/new">
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Facility</Button>
        </Link>
      </div>

      <div className="border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price/hr</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No facilities found.
                </TableCell>
              </TableRow>
            ) : (
              facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  <TableCell><Badge variant="outline">{facility.type}</Badge></TableCell>
                  <TableCell>{facility.location}</TableCell>
                  <TableCell>${facility.pricePerHour.toFixed(2)}</TableCell>
                  <TableCell>{facility.rating.toFixed(1)}</TableCell>
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
                        <Link href={`/facilities/${facility.id}`}>
                           <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Public Page</DropdownMenuItem>
                        </Link>
                        <Link href={`/admin/facilities/${facility.id}/edit`}>
                          <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        </Link>
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

      {facilityToDelete && (
        <AlertDialog open={!!facilityToDelete} onOpenChange={(open) => !open && setFacilityToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the facility "{facilityToDelete.name}"
                and all its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setFacilityToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteFacility} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
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
