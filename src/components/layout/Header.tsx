
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';
import { MountainSnow, Dices, Wand2, FileText, CalendarDays, Trophy, Calendar as CalendarIcon, Swords } from 'lucide-react'; 
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { getSiteSettingsAction } from '@/app/actions';
import { UserSwitcher } from '../shared/UserSwitcher';

const navItems = [
  { href: "/facilities", label: "Facilities" },
  { href: "/sports", label: "Sports" },
  { href: "/events", label: "Events" },
  { href: "/memberships", label: "Memberships" },
  { href: "/challenges", label: "Challenges" },
  { href: "/matchmaking", label: "Matchmaking" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [siteName, setSiteName] = useState('Sports Arena');

  useEffect(() => {
    const fetchSettings = async () => {
        const currentSettings = await getSiteSettingsAction();
        if (currentSettings.siteName !== siteName) {
            setSiteName(currentSettings.siteName);
        }
    }
    fetchSettings(); 

    const handleSettingsChange = () => {
        fetchSettings();
    };

    window.addEventListener('settingsChanged', handleSettingsChange);

    return () => {
      window.removeEventListener('settingsChanged', handleSettingsChange);
    };
  }, [siteName]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <MountainSnow className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg font-headline">
            {siteName}
          </span>
        </Link>
        
        <div className="hidden md:flex flex-1 items-center overflow-hidden [perspective:500px]">
          <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
            {/* Render the list twice for a seamless loop */}
            {navItems.map((item, index) => (
              <Link href={item.href} key={`first-${index}`} legacyBehavior>
                <a className="mx-3 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:-translate-y-1 hover:[transform:rotateX(-15deg)] duration-300">
                  {item.label}
                </a>
              </Link>
            ))}
            {navItems.map((item, index) => (
              <Link href={item.href} key={`second-${index}`} legacyBehavior>
                <a className="mx-3 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:-translate-y-1 hover:[transform:rotateX(-15deg)] duration-300">
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 md:ml-6">
            <>
              <Link href="/recommendation" className="hidden xl:inline-flex">
                <Button variant="ghost">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Recommender
                </Button>
              </Link>
              <Link href="/weekend-planner" className="hidden lg:inline-flex">
                <Button>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  AI Planner
                </Button>
              </Link>
              <UserSwitcher />
              <NotificationBell />
            </>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
