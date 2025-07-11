
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // This page is now just a router.
    // The Header component handles auth and redirects to either /login or /facilities.
    // If a user somehow lands here, we can give a fallback redirect.
    router.replace('/facilities');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingSpinner size={48} />
    </div>
  );
}
