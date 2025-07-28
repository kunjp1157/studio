
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, CheckCircle } from 'lucide-react';

const InfoPanel = () => (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 bg-secondary/30 p-8 text-white rounded-l-2xl">
        <div>
            <div className="flex items-center gap-3">
                <Trophy className="h-10 w-10 text-primary" />
                <h1 className="text-3xl font-bold font-headline text-foreground">Sports Arena</h1>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">Your ultimate destination for booking sports facilities.</p>
        </div>
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">What's New?</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle size={18} className="text-primary" /><span>Discover and book facilities in real-time.</span></li>
                <li className="flex items-center gap-2"><CheckCircle size={18} className="text-primary" /><span>Find players with our new Matchmaking feature.</span></li>
                <li className="flex items-center gap-2"><CheckCircle size={18} className="text-primary" /><span>Plan your entire sporty weekend with our AI Planner.</span></li>
                <li className="flex items-center gap-2"><CheckCircle size={18} className="text-primary" /><span>Compete and climb the new loyalty points Leaderboard.</span></li>
            </ul>
        </div>
        <div className="text-xs text-muted-foreground/70">
            &copy; {new Date().getFullYear()} Sports Arena. All Rights Reserved.
        </div>
    </div>
);


export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 auth-background">
      <div className="w-full max-w-4xl flex bg-card rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp">
        <InfoPanel />
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center">
            <CardTitle className="text-3xl font-bold text-primary mb-2">Authentication Removed</CardTitle>
            <CardDescription className="text-muted-foreground mb-8">
              Login is no longer required. You can now access all features directly.
            </CardDescription>
             <Link href="/facilities" className="font-bold text-primary hover:underline">
                Proceed to the app
             </Link>
        </div>
      </div>
    </div>
  );
}
