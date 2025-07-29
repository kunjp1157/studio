
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
        // If no login page, we can't redirect. For now, we'll just let them through
        // but a real app would have a login page.
        // We will assume a default user is set for demo purposes.
        setIsVerified(true);
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
