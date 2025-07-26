
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageTitle } from '@/components/shared/PageTitle';
import { SportAdminForm } from '@/components/admin/SportAdminForm';
import type { Sport } from '@/lib/types';
import { getSportById } from '@/lib/data';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function EditSportPage() {
  const params = useParams();
  const router = useRouter();
  const sportId = params.id as string;
  const [sport, setSport] = useState<Sport | null | undefined>(undefined); 

  useEffect(() => {
    if (sportId) {
      const foundSport = getSportById(sportId);
      setSport(foundSport || null);
    }
  }, [sportId]);

  if (sport === undefined) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="text-muted-foreground">Loading sport details...</p>
      </div>
    );
  }

  if (!sport) {
    return (
      <div className="space-y-8">
        <PageTitle title="Edit Sport" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: Sport Not Found</AlertTitle>
          <AlertDescription>The sport you are trying to edit could not be found.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/admin/sports')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sports List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title={`Edit: ${sport.name}`} description="Modify the details for this sport." />
      <SportAdminForm initialData={sport} />
    </div>
  );
}
