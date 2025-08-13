
'use client';

import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Search, CalendarDays, Ticket, Wand2, Star, Zap, Dices } from 'lucide-react';

const QuickLinkCard = ({ href, icon: Icon, title, description }: { href: string; icon: React.ElementType; title: string; description: string; }) => (
    <Link href={href} className="group block">
        <Card className="hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{description}</p>
                 <div className="text-sm font-semibold flex items-center mt-2 group-hover:text-primary">
                    Go <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
            </CardContent>
        </Card>
    </Link>
);

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center">
        <PageTitle 
            title="Welcome to Sports Arena"
            description="Your ultimate destination for booking sports facilities. Find a court, field, or pool and get playing today!"
        />
        <Link href="/facilities">
            <Button size="lg" className="mt-4 text-lg py-7 px-10">
                <Search className="mr-2 h-5 w-5"/>
                Find a Facility Now
            </Button>
        </Link>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Explore Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickLinkCard href="/facilities" icon={Search} title="Find a Facility" description="Browse and book venues" />
            <QuickLinkCard href="/account/bookings" icon={Ticket} title="My Bookings" description="Manage your reservations" />
            <QuickLinkCard href="/events" icon={CalendarDays} title="View Events" description="Join leagues & tournaments" />
            <QuickLinkCard href="/weekend-planner" icon={Wand2} title="AI Planner" description="Get a custom itinerary" />
        </div>
      </div>
    </div>
  );
}
