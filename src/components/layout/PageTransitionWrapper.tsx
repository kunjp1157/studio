
'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface PageTransitionWrapperProps {
  children: ReactNode;
}

export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-fadeInUp">
      {children}
    </div>
  );
}
