
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// This is just a redirector component.
// It redirects to the main dashboard, which is a protected route.
// The auth layout will then redirect to login if the user is not authenticated.
export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard');
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <LoadingSpinner size={48} />
        </div>
    );
}
