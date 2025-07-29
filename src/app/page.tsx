
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// This is a new root page. Its only purpose is to redirect to the main
// application page, which is now protected by the (app) layout.
export default function RootRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/facilities');
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <LoadingSpinner size={48} />
        </div>
    );
}
