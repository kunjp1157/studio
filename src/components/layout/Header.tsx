
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';
import { MountainSnow, Dices, Wand2, FileText, CalendarDays, Trophy, Calendar as CalendarIcon, Swords, Menu } from 'lucide-react'; 
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { getSiteSettingsAction } from '@/app/actions';
import { UserSwitcher } from '../shared/UserSwitcher';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <Link href="/" className="mx-2 flex items-center space-x-2">
          <MountainSnow className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg font-headline">
            {siteName}
          </span>
        </Link>
        
        <div className="hidden md:flex flex-1 items-center overflow-hidden [perspective:500px]">
          <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
            {navItems.map((item, index) => (
              <Link 
                href={item.href} 
                key={`first-${index}`}
                className="mx-3 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:-translate-y-2 hover:[transform:rotateX(-20deg)_rotateZ(-5deg)_scale(1.1)] duration-300"
              >
                {item.label}
              </Link>
            ))}
            {navItems.map((item, index) => (
              <Link 
                href={item.href} 
                key={`second-${index}`}
                className="mx-3 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:-translate-y-2 hover:[transform:rotateX(-20deg)_rotateZ(-5deg)_scale(1.1)] duration-300"
                aria-hidden="true"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 md:ml-6">
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
