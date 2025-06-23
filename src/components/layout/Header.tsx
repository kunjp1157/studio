
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';
import { MountainSnow, Dices, Wand2, FileText, CalendarDays, Trophy } from 'lucide-react'; 
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { getSiteSettings } from '@/lib/data';

export function Header() {
  const [siteName, setSiteName] = useState('Sports Arena'); // Start with a default

  useEffect(() => {
    // Function to update the site name state
    const fetchSiteName = () => {
      const currentSettings = getSiteSettings();
      // Only update state if the name has actually changed
      if (currentSettings.siteName !== siteName) {
        setSiteName(currentSettings.siteName);
      }
    };

    // Fetch the name immediately on component mount
    fetchSiteName();

    // Set up polling to check for updates every 3 seconds
    const intervalId = setInterval(fetchSiteName, 3000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [siteName]); // Re-run effect if siteName changes to ensure the interval closure has the latest state

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <MountainSnow className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg font-headline">
            {siteName}
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-1 sm:space-x-2 md:space-x-4">
          <Link href="/facilities">
            <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3">Facilities</Button>
          </Link>
          <Link href="/sports">
            <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3">
                <Dices className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Sports</span>
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3">
                <CalendarDays className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Events</span>
            </Button>
          </Link>
          <Link href="/memberships">
            <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3">Memberships</Button>
          </Link>
          <Link href="/blog">
            <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3">
                <FileText className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Blog</span>
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3">
                <Trophy className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Leaderboard</span>
            </Button>
          </Link>
          <Link href="/recommendation" className="ml-auto md:ml-0">
            <Button variant="ghost" className="text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 px-2 sm:px-3">
                <Wand2 className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">AI Recommender</span>
                <span className="sm:hidden">AI</span>
            </Button>
          </Link>
        </nav>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <NotificationBell />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
