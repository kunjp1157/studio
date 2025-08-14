
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '@/lib/types';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
        setCurrentUser(JSON.parse(activeUser));
    }
  }, []);
  
  const handleGetStartedClick = () => {
      if(currentUser) {
          router.push('/facilities');
      } else {
          router.push('/account/login');
      }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden bg-background text-foreground">
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight animated animate-fade-in-up">Welcome to Sports Arena</h1>
        <p className="mt-4 max-w-lg mx-auto text-muted-foreground leading-relaxed animated animate-fade-in-up animation-delay-200">Your ultimate destination for booking sports facilities, joining events, and connecting with players. Your next game is just a click away.</p>
        <Button
            className="mt-8 animated animate-fade-in-up animation-delay-400"
            size="lg"
            onClick={handleGetStartedClick}
          >
              {currentUser ? 'Browse Facilities' : 'Get Started'}
        </Button>
      </div>
    </div>
  );
}
