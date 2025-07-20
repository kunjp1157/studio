
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is just a redirector component. The actual dashboard content is in /admin/dashboard.
// This handles the case where a user navigates to the bare `/admin` route.
export default function AdminRootPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/dashboard');
    }, [router]);

    // You can return a loading spinner here for better UX while redirecting
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Redirecting to dashboard...</p>
        </div>
    );
}
