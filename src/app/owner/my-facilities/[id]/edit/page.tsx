
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { FacilityAdminForm } from '@/components/admin/FacilityAdminForm';
import type { Facility, UserProfile } from '@/lib/types';
import { getFacilityByIdAction } from '@/app/actions';
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
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
        setCurrentUser(JSON.parse(activeUser));
    }
  }, []);

  useEffect(() => {
    if (facilityId && currentUser) {
      setIsLoading(true);
      const fetchFacility = async () => {
          const foundFacility = await getFacilityByIdAction(facilityId);
          if (foundFacility) {
            if (foundFacility.ownerId === currentUser.id) {
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
  }, [facilityId, currentUser]);

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
  
  if (!facility || !currentUser) {
     return (
      <div className="space-y-8 container mx-auto py-8 px-4 md:px-6">
        <PageTitle title="Edit Facility" />
         <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Facility Data Unavailable</AlertTitle>
            <AlertDescription>The facility data or user session could not be loaded.</AlertDescription>
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
        currentUserRole={currentUser.role}
      />
    </div>
  );
}
