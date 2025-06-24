
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Facility, SiteSettings } from '@/lib/types';
import { mockUser } from '@/lib/data'; 
import { getFacilitiesByOwnerIdAction, getSiteSettingsAction } from '@/app/actions';
import { PlusCircle, MoreHorizontal, Edit, Eye, Building2, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function OwnerFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const { toast } = useToast();

  const ownerId = mockUser.id; 

  useEffect(() => {
    const fetchData = async () => {
      if (!ownerId) {
        toast({
            title: "Authentication Error",
            description: "Could not determine the current user. Please log in again.",
            variant: "destructive",
        });
        setFacilities([]);
        return;
      }
      const [ownerFacilities, settings] = await Promise.all([
          getFacilitiesByOwnerIdAction(ownerId),
          getSiteSettingsAction()
      ]);

      setFacilities(currentFacilities => {
        if (JSON.stringify(currentFacilities) !== JSON.stringify(ownerFacilities)) {
            return ownerFacilities;
        }
        return currentFacilities;
      });
      setCurrency(settings.defaultCurrency);
    };

    fetchData().finally(() => setIsLoading(false));
    
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [ownerId, toast]);


  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageTitle title="Manage Your Facilities" description="View, edit, and update details for your listed sports facilities." />
        <Card className="shadow-lg">
          <CardHeader>
             <CardTitle className="flex items-center"><Building2 className="mr-2 h-6 w-6 text-primary"/>Loading Your Facilities...</CardTitle>
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
      <PageTitle title="Manage Your Facilities" description="View, edit, and update details for your listed sports facilities." />
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <CardTitle className="flex items-center"><Building2 className="mr-2 h-6 w-6 text-primary"/>Your Facility Listings</CardTitle>
                <CardDescription>Add new facilities or edit details for your existing venues.</CardDescription>
            </div>
            <Link href="/owner/my-facilities/new">
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Facility</Button>
            </Link>
        </CardHeader>
        <CardContent>
            {facilities.length === 0 ? (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Facilities Found</AlertTitle>
                    <AlertDescription>
                        You haven't added any facilities yet. 
                        <Link href="/owner/my-facilities/new" className="font-semibold underline ml-1">Click here to add your first facility!</Link>
                    </AlertDescription>
                </Alert>
            ) : (
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
                        {facilities.map((facility) => (
                            <TableRow key={facility.id}>
                            <TableCell className="font-medium">{facility.name}</TableCell>
                            <TableCell><Badge variant="outline">{facility.type}</Badge></TableCell>
                            <TableCell>{facility.location}</TableCell>
                            <TableCell>{currency ? formatCurrency(facility.pricePerHour, currency) : <Skeleton className="h-5 w-16" />}</TableCell>
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
                                    <Link href={`/facilities/${facility.id}`} legacyBehavior passHref>
                                    <DropdownMenuItem asChild><a><Eye className="mr-2 h-4 w-4" /> View Public Page</a></DropdownMenuItem>
                                    </Link>
                                    <Link href={`/owner/my-facilities/${facility.id}/edit`} legacyBehavior passHref>
                                    <DropdownMenuItem asChild><a><Edit className="mr-2 h-4 w-4" /> Edit Details</a></DropdownMenuItem>
                                    </Link>
                                    {/* Delete functionality can be added here later */}
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
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
