
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function OwnerPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/owner/dashboard');
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <LoadingSpinner size={48} />
        </div>
    );
}
