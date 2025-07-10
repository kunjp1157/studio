
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/account/login');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingSpinner size={48} />
    </div>
  );
}
