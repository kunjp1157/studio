
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { FacilityAdminForm } from '@/components/admin/FacilityAdminForm';
import type { Facility } from '@/lib/types';
import { getFacilityByIdAction } from '@/app/actions';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditFacilityPage() {
  const params = useParams();
  const router = useRouter();
  const facilityId = params.id as string;
  const [facility, setFacility] = useState<Facility | null | undefined>(undefined); // undefined: loading, null: not found

  useEffect(() => {
    if (facilityId) {
      const fetchFacility = async () => {
        const foundFacility = await getFacilityByIdAction(facilityId);
        setFacility(foundFacility || null);
      };
      fetchFacility();
    }
  }, [facilityId]);

  if (facility === undefined) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="text-muted-foreground">Loading facility details...</p>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="space-y-8">
        <PageTitle title="Edit Facility" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: Facility Not Found</AlertTitle>
          <AlertDescription>The facility you are trying to edit could not be found.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/admin/facilities')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Facilities List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title={`Edit: ${facility.name}`} description="Modify the details for this sports facility." />
      <FacilityAdminForm initialData={facility} />
    </div>
  );
}
