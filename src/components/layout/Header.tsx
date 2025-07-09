
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';
import { MountainSnow, Dices, Wand2, FileText, CalendarDays, Trophy, Calendar as CalendarIcon, Swords } from 'lucide-react'; 
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { getSiteSettingsAction } from '@/app/actions';

export function Header() {
  const [siteName, setSiteName] = useState('Sports Arena');

  useEffect(() => {
    const fetchSiteName = async () => {
      const currentSettings = await getSiteSettingsAction();
      if (currentSettings.siteName !== siteName) {
        setSiteName(currentSettings.siteName);
      }
    };
    fetchSiteName();
    const intervalId = setInterval(fetchSiteName, 3000);
    return () => clearInterval(intervalId);
  }, [siteName]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-4 flex items-center space-x-2">
          <MountainSnow className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg font-headline">
            {siteName}
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link href="/facilities"><Button variant="ghost" className="text-sm font-medium">Facilities</Button></Link>
          <Link href="/sports"><Button variant="ghost" className="text-sm font-medium">Sports</Button></Link>
          <Link href="/events"><Button variant="ghost" className="text-sm font-medium">Events</Button></Link>
          <Link href="/memberships"><Button variant="ghost" className="text-sm font-medium">Memberships</Button></Link>
          <Link href="/challenges"><Button variant="ghost" className="text-sm font-medium">Challenges</Button></Link>
          <Link href="/matchmaking"><Button variant="ghost" className="text-sm font-medium">Matchmaking</Button></Link>
          <Link href="/leaderboard"><Button variant="ghost" className="text-sm font-medium">Leaderboard</Button></Link>
          <Link href="/blog"><Button variant="ghost" className="text-sm font-medium">Blog</Button></Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Link href="/recommendation" className="hidden lg:inline-flex">
            <Button variant="ghost">
              <Wand2 className="h-4 w-4 mr-2" />
              Recommender
            </Button>
          </Link>
          <Link href="/weekend-planner" className="hidden sm:inline-flex">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <CalendarIcon className="h-4 w-4 mr-2" />
              AI Planner
            </Button>
          </Link>
          <NotificationBell />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
