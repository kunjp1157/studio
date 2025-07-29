
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';
import { Trophy, Dices, Wand2, FileText, CalendarDays, Calendar as CalendarIcon, Swords, Menu } from 'lucide-react'; 
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { getSiteSettingsAction } from '@/app/actions';
import { UserSwitcher } from '../shared/UserSwitcher';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { UserProfile } from '@/lib/types';

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

const AnimatedLogo = ({ text }: { text: string }) => {
    const letters = text.split('');
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const runAnimation = () => {
            const spans = containerRef.current?.children;
            if (!spans) return;
            for (let i = 0; i < spans.length; i++) {
                spans[i].classList.remove('fall');
            }
            setTimeout(() => {
                for (let i = 0; i < spans.length; i++) {
                    setTimeout(() => {
                        spans[i].classList.add('fall');
                    }, i * 80);
                }
            }, 100);
        };
        
        runAnimation();
        const interval = setInterval(runAnimation, 7000);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <span ref={containerRef} className="text-xl font-bold font-headline transition-colors group-hover:text-primary/80">
            {letters.map((char, index) => (
                <span key={`${char}-${index}`} className="letter">
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </span>
    );
};


export function Header() {
  const [siteName, setSiteName] = useState('Sports Arena');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

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

    const handleUserChange = () => {
        const activeUser = sessionStorage.getItem('activeUser');
        if (activeUser) {
            setCurrentUser(JSON.parse(activeUser));
        } else {
            setCurrentUser(null);
        }
    };
    
    // Initial check
    handleUserChange();
    
    window.addEventListener('userChanged', handleUserChange);


    return () => {
      window.removeEventListener('settingsChanged', handleSettingsChange);
      window.removeEventListener('userChanged', handleUserChange);
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
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                   <Trophy className="h-6 w-6 text-primary" />
                   {siteName}
                </SheetTitle>
              </SheetHeader>
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
        
        <Link href="/" className="group mx-2 flex items-center space-x-2" style={{ perspective: '500px' }}>
          <Trophy className="h-6 w-6 text-primary transition-transform duration-300 group-hover:-rotate-12 animate-float-3d" />
          <AnimatedLogo text={siteName} />
        </Link>
        
        {currentUser && (
          <div className="hidden md:flex flex-1 items-center overflow-hidden [perspective:500px]">
            <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
              {navItems.map((item, index) => (
                <Link 
                  href={item.href} 
                  key={`first-${index}`}
                  className="mx-2 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/70 hover:text-primary rounded-md duration-300 hover:[transform:rotateX(15deg)_scale(1.1)]"
                >
                  {item.label}
                </Link>
              ))}
              {navItems.map((item, index) => (
                <Link 
                  href={item.href} 
                  key={`second-${index}`}
                  className="mx-2 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/70 hover:text-primary rounded-md duration-300 hover:[transform:rotateX(15deg)_scale(1.1)]"
                  aria-hidden="true"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-1 items-center justify-end space-x-2 md:ml-6">
            {currentUser && (
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
            )}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
