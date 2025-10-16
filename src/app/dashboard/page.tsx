
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Search, CalendarDays, Ticket, Wand2, Star, Zap, Dices } from 'lucide-react';
import type { UserProfile, Facility, Sport, SiteSettings } from '@/lib/types';
import { getFacilitiesAction, getAllSportsAction, getSiteSettingsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { getIconComponent } from '@/components/shared/Icon';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';


const QuickLinkCard = ({ href, icon: Icon, title, description, className }: { href: string; icon: React.ElementType; title: string; description: string; className?: string }) => (
    <Link href={href} className="group block">
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

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const { toast } = useToast();
  
  const [featuredFacilities, setFeaturedFacilities] = useState<Facility[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        const [facilitiesData, sportsData, settingsData] = await Promise.all([
            getFacilitiesAction(),
            getAllSportsAction(),
            getSiteSettingsAction()
        ]);
        setFacilities(facilitiesData);
        setSports(sportsData);
        setCurrency(settingsData.defaultCurrency);
    } catch (error) {
        toast({ title: "Error", description: "Failed to load dashboard data.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);
  
  useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
        setCurrentUser(JSON.parse(activeUser));
    }
    fetchData();

    const handleDataChange = () => {
        fetchData();
    };
    window.addEventListener('dataChanged', handleDataChange);
    return () => {
        window.removeEventListener('dataChanged', handleDataChange);
    };
  }, [fetchData]);
  
  useEffect(() => {
    if (facilities.length > 0 && currentUser) {
        // Simple city logic: Try to find facilities in the user's city, else default to Pune, else use all.
        let cityFacilities = facilities.filter(f => f.city === 'Pune'); // Assuming user's city isn't on profile
        if (cityFacilities.length === 0) {
            cityFacilities = facilities;
        }
        
        const popularFacilities = cityFacilities
            .filter(f => f.isPopular || f.rating >= 4.5)
            .sort((a,b) => b.rating - a.rating);
            
        setFeaturedFacilities(popularFacilities.length > 0 ? popularFacilities : cityFacilities.slice(0, 5));
        setCurrentFeaturedIndex(0);
    }
  }, [facilities, currentUser]);
  
  useEffect(() => {
    if (featuredFacilities.length > 1) {
        const timer = setInterval(() => {
            setCurrentFeaturedIndex(prevIndex => (prevIndex + 1) % featuredFacilities.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(timer);
    }
  }, [featuredFacilities]);

  const popularSports = useMemo(() => sports
    .map(sport => ({
        ...sport,
        venueCount: facilities.filter(f => f.sports.some(s => s.id === sport.id)).length
    }))
    .filter(sport => sport.venueCount > 0)
    .sort((a, b) => b.venueCount - a.venueCount)
    .slice(0, 5), [sports, facilities]);

  if (isLoading || !currentUser) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">Loading Dashboard...</h2>
                </div>
            </div>
        </div>
    );
  }

  const currentFeaturedFacility = featuredFacilities[currentFeaturedIndex];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle 
        title={`Welcome back, ${currentUser.name}!`}
        description="Here's what's happening at Sports Arena. Ready to play?"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickLinkCard href="/facilities" icon={Search} title="Find a Facility" description="Browse and book venues" />
        <QuickLinkCard href="/account/bookings" icon={Ticket} title="My Bookings" description="Manage your reservations" />
        <QuickLinkCard href="/events" icon={CalendarDays} title="View Events" description="Join leagues & tournaments" />
        <QuickLinkCard href="/weekend-planner" icon={Wand2} title="AI Planner" description="Get a custom itinerary" className="bg-primary/5"/>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 font-headline">Featured Facility</h2>
            {currentFeaturedFacility ? (
                <Link href={`/facilities/${currentFeaturedFacility.id}`}>
                    <Card className="group overflow-hidden relative shadow-lg hover:shadow-xl transition-all duration-300 aspect-video rounded-2xl">
                         <Image
                            key={currentFeaturedFacility.id}
                            src={`https://picsum.photos/seed/${currentFeaturedFacility.id}/1200/675`}
                            alt={currentFeaturedFacility.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105 animate-fadeInUp"
                            data-ai-hint={currentFeaturedFacility.dataAiHint || 'sports facility'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"/>
                        <CardHeader className="absolute bottom-0 left-0 p-6 text-white">
                            <CardTitle className="text-3xl font-headline group-hover:text-primary transition-colors">{currentFeaturedFacility.name}</CardTitle>
                            <CardDescription className="text-white/80 flex items-center mt-1">
                                <Star className="w-4 h-4 mr-1.5 text-yellow-400 fill-yellow-400"/> {currentFeaturedFacility.rating} &middot; {currentFeaturedFacility.location}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            ) : <Skeleton className="w-full h-64 rounded-lg"/> }
        </div>

        <div>
            <h2 className="text-2xl font-bold mb-4 font-headline">Popular Sports</h2>
            <Card>
                <CardContent className="p-4 space-y-3">
                    {popularSports.length > 0 ? popularSports.map(sport => {
                        const Icon = getIconComponent(sport.iconName) || Dices;
                        return (
                             <Link key={sport.id} href={`/facilities?sport=${sport.id}`} className="group block">
                                <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-6 h-6 text-primary"/>
                                        <span className="font-semibold">{sport.name}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{sport.venueCount} venues</span>
                                </div>
                            </Link>
                        )
                    }) : Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-12 w-full"/>)}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
