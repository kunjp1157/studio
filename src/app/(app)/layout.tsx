
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const activeUser = sessionStorage.getItem('activeUser');
      if (!activeUser) {
        toast({
          title: 'Please log in',
          description: 'You need to be logged in to access this page.',
          variant: 'destructive',
        });
        router.replace('/account/login');
      } else {
        setIsVerified(true);
      }
    };
    checkAuth();
  }, [router, toast]);

  if (!isVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return <>{children}</>;
}
