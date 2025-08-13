
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Sparkles,
  Trophy,
  Dices,
  Swords,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const FeatureCard = ({ icon: Icon, title, description, href, className }: { icon: React.ElementType, title: string, description: string, href: string, className?: string }) => (
    <Link href={href} className="group block">
        <Card className={cn("text-center items-center flex flex-col h-full bg-card/50 hover:bg-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2", className)}>
            <CardHeader className="items-center">
                <div className="p-4 bg-background rounded-full mb-2 border border-border">
                    <Icon className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">{description}</p>
            </CardContent>
        </Card>
    </Link>
);


export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-15%] h-[400px] w-[300px] bg-primary/80 -rotate-45 transform-gpu rounded-[50px] blur-3xl opacity-20" />
          <div className="absolute bottom-[-10%] right-[-15%] h-[400px] w-[300px] bg-secondary/80 rotate-45 transform-gpu rounded-[50px] blur-3xl opacity-20" />
          <div className="absolute hidden md:block top-[5%] right-[10%] h-[200px] w-[200px] border-4 border-muted-foreground/10 rounded-full" />
          <div className="absolute hidden md:block bottom-[10%] left-[5%] h-[150px] w-[150px] border-4 border-muted-foreground/10 rounded-full" />
          {/* Dot Pattern */}
          <div 
            className="absolute inset-0 z-[-1]"
            style={{
                backgroundImage: 'radial-gradient(hsl(var(--muted-foreground) / 0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
            }}
          />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-12 py-20 md:py-28 px-4 md:px-6">
        
        {/* Hero Section */}
        <div className="space-y-6 animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground font-headline">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Sports Arena</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Your ultimate destination for booking sports facilities. Find a court, field, or pool and get playing today!
          </p>
           <Link href="/facilities">
            <Button size="lg" className="text-lg py-7 px-10 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                <Search className="mr-2 h-5 w-5"/>
                Get Started
            </Button>
          </Link>
        </div>

        <Separator className="my-20 w-1/2 bg-border/50"/>
        
        {/* Features Section */}
        <div className="w-full max-w-6xl animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <h2 className="text-4xl font-bold mb-10 font-headline">Explore Our Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard 
                    href="/events"
                    icon={CalendarDays}
                    title="Events & Tournaments"
                    description="Join exciting competitive leagues and friendly tournaments happening across the city."
                />
                <FeatureCard 
                    href="/memberships"
                    icon={Trophy}
                    title="Exclusive Memberships"
                    description="Unlock special perks, booking discounts, and priority access with our membership plans."
                />
                 <FeatureCard 
                    href="/matchmaking"
                    icon={Swords}
                    title="Player Matchmaking"
                    description="Find other players for a casual game or a competitive match-up. Never play alone again!"
                />
                <FeatureCard 
                    href="/weekend-planner"
                    icon={Sparkles}
                    title="AI Weekend Planner"
                    description="Let our intelligent planner create the perfect sporty weekend for you based on your preferences."
                />
            </div>
        </div>

      </div>
    </div>
  );
}
