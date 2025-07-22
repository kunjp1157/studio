
'use client';

import { useState, useEffect } from 'react';
import { SportCard } from '@/components/sports/SportCard';
import { PageTitle } from '@/components/shared/PageTitle';
import type { Sport } from '@/lib/types';
import { mockSports } from '@/lib/mock-data';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching sports data
    setTimeout(() => {
      setSports(mockSports);
      setIsLoading(false);
    }, 300);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <PageTitle 
          title="Explore Sports"
          description="Discover various sports and find facilities to play them."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 8 }).map((_, index) => (
             <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle 
        title="Explore Sports"
        description="Discover various sports and find facilities to play them."
      />

      {sports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {sports.map((sport) => (
            <SportCard key={sport.id} sport={sport} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8">No sports available at the moment. Please check back later.</p>
      )}
    </div>
  );
}

// Simple skeleton for loading state
const CardSkeleton = () => (
  <div className="bg-card p-4 rounded-lg shadow-md animate-pulse">
    <div className="aspect-[4/3] bg-muted rounded mb-4"></div>
    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
    <div className="h-10 bg-muted rounded w-full mt-2"></div>
  </div>
);
