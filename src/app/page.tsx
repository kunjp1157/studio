
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  CalendarDays,
  Sparkles,
  Trophy,
  Dices,
  Swords,
  Feather,
  Dribbble,
  Goal,
  PersonStanding,
  Bike,
  Music,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getIconComponent } from '@/components/shared/Icon';
import { mockSports, getStaticFacilities } from '@/lib/mock-data';
import type { Facility } from '@/lib/types';

const AnimatedLogo = ({ text }: { text: string }) => {
  const letters = text.split('');
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const runAnimation = () => {
      const spans = containerRef.current?.children;
      if (!spans) return;
      Array.from(spans).forEach(span => span.classList.remove('fall'));
      setTimeout(() => {
        Array.from(spans).forEach((span, i) => {
          setTimeout(() => {
            span.classList.add('fall');
          }, i * 80);
        });
      }, 100);
    };
    runAnimation();
    const interval = setInterval(runAnimation, 7000);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span ref={containerRef} className="text-5xl md:text-7xl font-bold tracking-tight text-foreground font-headline">
      {letters.map((char, index) => (
        <span key={`${char}-${index}`} className="letter" style={{ animationDelay: `${index * 0.05}s` }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

const SportMarquee = () => (
  <div className="relative flex w-full overflow-x-hidden text-muted-foreground my-12">
    <div className="flex animate-marquee whitespace-nowrap">
      {mockSports.map((sport, index) => {
        const Icon = getIconComponent(sport.iconName) || Dices;
        return (
          <div key={`marquee1-${index}`} className="flex items-center mx-4">
            <Icon className="w-5 h-5 mr-2 text-primary" />
            <span className="text-lg font-medium">{sport.name}</span>
          </div>
        );
      })}
    </div>
    <div className="absolute top-0 flex animate-marquee whitespace-nowrap">
        {mockSports.map((sport, index) => {
        const Icon = getIconComponent(sport.iconName) || Dices;
        return (
          <div key={`marquee2-${index}`} className="flex items-center mx-4">
            <Icon className="w-5 h-5 mr-2 text-primary" />
            <span className="text-lg font-medium">{sport.name}</span>
          </div>
        );
      })}
    </div>
  </div>
);


export default function HomePage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  
  useEffect(() => {
    setFacilities(getStaticFacilities());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12 py-12 md:py-20 px-4 md:px-6">
      
      {/* Hero Section */}
      <div className="space-y-4" style={{ perspective: '1000px' }}>
         <Trophy className="mx-auto h-12 w-12 text-primary animate-wave" />
         <AnimatedLogo text="Sports Arena" />
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground animate-fadeInUp" style={{animationDelay: '1s'}}>
          Your ultimate destination for booking sports facilities. Find a court, field, or pool and get playing today!
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-xl animate-fadeInUp" style={{animationDelay: '1.2s'}}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a facility or sport..."
            className="pl-12 pr-24 h-14 text-lg rounded-full shadow-lg"
          />
          <Link href="/facilities" className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button type="submit" size="lg" className="rounded-full">
              Find Venue
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Key Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl animate-fadeInUp" style={{animationDelay: '1.4s'}}>
        <Card className="animate-float-3d" style={{animationDelay: '0s'}}>
          <CardHeader>
            <CardTitle className="flex items-center"><CalendarDays className="mr-2 text-primary"/>Events & Tournaments</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Join exciting competitive leagues and friendly tournaments.</p>
            <Link href="/events"><Button variant="link" className="px-0">Explore Events <span className="ml-1">&rarr;</span></Button></Link>
          </CardContent>
        </Card>
        <Card className="animate-float-3d" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle className="flex items-center"><Trophy className="mr-2 text-primary"/>Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Unlock exclusive perks, discounts, and priority booking.</p>
            <Link href="/memberships"><Button variant="link" className="px-0">View Plans <span className="ml-1">&rarr;</span></Button></Link>
          </CardContent>
        </Card>
        <Card className="animate-float-3d" style={{animationDelay: '0.4s'}}>
          <CardHeader>
            <CardTitle className="flex items-center"><Sparkles className="mr-2 text-primary"/>AI Planner</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Let our AI plan the perfect sporty weekend for you.</p>
            <Link href="/weekend-planner"><Button variant="link" className="px-0">Plan My Weekend <span className="ml-1">&rarr;</span></Button></Link>
          </CardContent>
        </Card>
      </div>

       {/* Marquee Section */}
      <div className="w-full">
         <SportMarquee />
      </div>

    </div>
  );
}
