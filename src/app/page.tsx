
'use client';

import Link from 'next/link';
import {
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGridBackground } from '@/components/layout/AnimatedGridBackground';


export default function HomePage() {
  return (
    <div className="auth-page">
      <AnimatedGridBackground />
      <div className="home-box">
        <div className="auth-container">
          <div className="auth-form-wrapper">
             <div className="space-y-6 text-center">
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
          </div>
        </div>
      </div>
    </div>
  );
}
