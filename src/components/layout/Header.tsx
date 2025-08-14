
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';
import { Trophy, Dices, Wand2, FileText, CalendarDays, Calendar as CalendarIcon, Swords, Menu, Sparkles, Building2 } from 'lucide-react'; 
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { getSiteSettingsAction } from '@/app/actions';
import { UserSwitcher } from '../shared/UserSwitcher';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { UserProfile } from '@/lib/types';
import { Separator } from '../ui/separator';

const navItems = [
  { href: "/facilities", label: "Facilities", icon: Building2 },
  { href: "/sports", label: "Sports", icon: Swords },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/memberships", label: "Memberships", icon: Trophy },
  { href: "/challenges", label: "Challenges", icon: Swords },
  { href: "/matchmaking", label: "Matchmaking", icon: Dices },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/blog", label: "Blog", icon: FileText },
];

const aiNavItems = [
    { href: "/recommendation", label: "AI Recommender", icon: Wand2 },
    { href: "/weekend-planner", label: "AI Weekend Planner", icon: CalendarIcon },
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
                    {char === ' ' ? ' ' : char}
                </span>
            ))}
        </span>
    );
};


export function Header() {
  const [siteName, setSiteName] = useState('Sports Arena');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  const fetchSettings = useCallback(async () => {
    const currentSettings = await getSiteSettingsAction();
    if (currentSettings.siteName !== siteName) {
        setSiteName(currentSettings.siteName);
    }
  }, [siteName]);

  useEffect(() => {
    fetchSettings(); 

    const handleDataChange = () => {
        fetchSettings();
    };

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
    
    window.addEventListener('dataChanged', handleDataChange);
    window.addEventListener('userChanged', handleUserChange);


    return () => {
      window.removeEventListener('dataChanged', handleDataChange);
      window.removeEventListener('userChanged', handleUserChange);
    };
  }, [fetchSettings]);

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
              <nav className="grid gap-4 text-lg font-medium mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                 <Separator className="my-2" />
                 <div className="text-sm font-semibold text-muted-foreground px-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI Tools</div>
                 {aiNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
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
            <div className="flex animate-marquee motion-safe:animate-marquee-slow hover:[animation-play-state:paused] whitespace-nowrap">
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
                {currentUser.role === 'Admin' && <UserSwitcher />}
                <NotificationBell />
              </>
            )}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
