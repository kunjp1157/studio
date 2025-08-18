
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Search, Ticket, CalendarDays, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const QuickLinkCard = ({ href, icon: Icon, title, description, className }: { href: string; icon: React.ElementType; title: string; description: string; className?: string }) => (
    <Link href={href} className="group block h-full">
        <Card className={cn("hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full", className)}>
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
    <div className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden bg-brand-dark text-white">
      <div 
        className="relative z-10 max-w-4xl w-full group"
        style={{ perspective: '1000px' }}
      >
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight text-gradient transition-transform duration-500 ease-out animate-float-3d group-hover:[transform:rotateX(15deg)_translateZ(40px)]"
        >
          SPORTS ARENA
        </h1>
        <p
          className="mt-4 max-w-lg mx-auto text-gray-300 leading-relaxed animated animate-fade-in-up animation-delay-200"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
        >
          Your ultimate destination for booking sports facilities, joining
          events, and connecting with players. Your next game is just a click
          away.
        </p>
        <div className="mt-8 animated animate-fade-in-up animation-delay-400">
           <Button asChild size="lg" className="px-8 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transform transition duration-300">
            <Link href="/facilities">Get Started</Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animated animate-fade-in-up animation-delay-600 text-left">
            <QuickLinkCard href="/facilities" icon={Search} title="Find a Facility" description="Browse and book venues" />
            <QuickLinkCard href="/account/bookings" icon={Ticket} title="My Bookings" description="Manage your reservations" />
            <QuickLinkCard href="/events" icon={CalendarDays} title="View Events" description="Join leagues & tournaments" />
            <QuickLinkCard href="/weekend-planner" icon={Wand2} title="AI Planner" description="Get a custom itinerary" className="bg-primary/10"/>
        </div>
      </div>
    </div>
  );
}
