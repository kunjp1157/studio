
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { FacilityAdminForm } from '@/components/admin/FacilityAdminForm';
import type { Facility } from '@/lib/types';
import { getFacilityById, mockUser } from '@/lib/data';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function EditOwnerFacilityPage() {
  const params = useParams();
  const router = useRouter();
  const facilityId = params.id as string;
  const [facility, setFacility] = useState<Facility | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Assuming mockUser.id is the ID of the currently logged-in owner
  const currentOwnerId = mockUser.id;

  useEffect(() => {
    if (facilityId) {
      setIsLoading(true);
      const fetchFacility = async () => {
          const foundFacility = await getFacilityById(facilityId);
          if (foundFacility) {
            if (foundFacility.ownerId === currentOwnerId) {
              setFacility(foundFacility);
            } else {
              setError("You do not have permission to edit this facility.");
              setFacility(null);
            }
          } else {
            setError("Facility not found.");
            setFacility(null);
          }
          setIsLoading(false);
      }
      fetchFacility();
    }
  }, [facilityId, currentOwnerId]);

  if (isLoading) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="text-muted-foreground">Loading facility details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 container mx-auto py-8 px-4 md:px-6">
        <PageTitle title="Edit Facility" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/owner/my-facilities')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Facilities
        </Button>
      </div>
    );
  }
  
  if (!facility) {
     // This case should ideally be caught by the error state if facility is not found
     return (
      <div className="space-y-8 container mx-auto py-8 px-4 md:px-6">
        <PageTitle title="Edit Facility" />
         <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Facility Data Unavailable</AlertTitle>
            <AlertDescription>The facility data could not be loaded.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/owner/my-facilities')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Facilities
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <PageTitle title={`Edit: ${facility.name}`} description="Modify the details for your facility." />
      <FacilityAdminForm 
        initialData={facility} 
        onSubmitSuccess={() => router.push('/owner/my-facilities')} 
      />
    </div>
  );
}
