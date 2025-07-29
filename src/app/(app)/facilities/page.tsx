

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SearchFilters, Amenity as AmenityType, SiteSettings, Facility } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, MapPin, CalendarDays, Filter, Dices,LayoutPanelLeft, SunMoon, DollarSign, ListChecks, Clock, Building, ArrowRight, Star, Wand2, Swords, Sparkles, Trophy } from 'lucide-react';
import { getMockSports, mockAmenities } from '@/lib/mock-data'; 
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { formatCurrency } from '@/lib/utils';
import { getIconComponent } from '@/components/shared/Icon';
import Link from 'next/link';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { getFacilitiesAction, getSiteSettingsAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { IconComponent } from '@/components/shared/Icon';
import { cn } from '@/lib/utils';
import { AlertCircle, SortAsc } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { PageTitle } from '@/components/shared/PageTitle';
import { FacilitySearchForm } from '@/components/facilities/FacilitySearchForm';

const CardSkeleton = () => (
    <div className="bg-card p-4 rounded-lg shadow-md">
        <Skeleton className="h-48 w-full rounded mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
    </div>
);


type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

const AnimatedText = ({ text, el: El = 'span', className, stagger = 80, repeatInterval = 5000 }: { text: string; el?: React.ElementType; className?: string; stagger?: number, repeatInterval?: number }) => {
    const letters = text.split('');
    const containerRef = useRef<HTMLElement>(null);

    const runAnimation = () => {
        const spans = containerRef.current?.children;
        if (!spans) return;

        // Reset by removing the 'fall' class
        for (let i = 0; i < spans.length; i++) {
            spans[i].classList.remove('fall');
        }

        // Add 'fall' class with a stagger after a short delay to allow reset
        setTimeout(() => {
            for (let i = 0; i < spans.length; i++) {
                setTimeout(() => {
                    spans[i].classList.add('fall');
                }, i * stagger);
            }
        }, 100);
    };

    useEffect(() => {
        // Initial animation
        runAnimation();

        // Set up repeating animation
        const interval = setInterval(runAnimation, repeatInterval);

        // Cleanup on component unmount
        return () => clearInterval(interval);
    }, [text, stagger, repeatInterval]);

    return (
        <El className={className} ref={containerRef}>
            {letters.map((char, index) => (
                <span
                    key={`${char}-${index}`}
                    className="letter"
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </El>
    );
};


const HeroSection = () => {
    return (
        <section className="text-center py-20 lg:py-28 auth-background rounded-2xl shadow-2xl" style={{ perspective: '500px' }}>
            <div className="container mx-auto px-4 md:px-6">
                 <AnimatedText 
                    text="Find & Book Your Perfect Sports Arena"
                    el="h1"
                    className="text-4xl md:text-6xl font-bold font-headline tracking-tighter break-words"
                    stagger={50}
                    repeatInterval={7000}
                />
                <AnimatedText
                    text="The ultimate platform to discover and book sports facilities in your city. Stop searching, start playing."
                    el="p"
                    className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground break-words"
                    stagger={20}
                    repeatInterval={7000}
                />
                <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '2.5s' }}>
                    <Link href="/facilities">
                        <Button size="lg" className="text-lg py-7 px-10 rounded-full hover:scale-110 transition-transform duration-300 animate-glow">
                            Explore Facilities <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};


const FeatureCard = ({ icon, title, description, index }: { icon: string; title: string; description: string; index: number }) => {
    return (
        <Card className={cn("text-center p-6 bg-secondary/30 transition-all duration-300 ease-in-out group preserve-3d h-full flex flex-col justify-center animate-float-3d hover:!animate-none hover:-translate-y-2 hover:[transform:rotateX(10deg)_rotateY(-5deg)_scale(1.05)] hover:shadow-2xl hover:shadow-primary/20 rounded-xl")}
              style={{ animationDelay: `${index * 200}ms` }}
        >
            <IconComponent name={icon} className="mx-auto h-10 w-10 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
        </Card>
    );
};


const FeaturesSection = () => {
    const features = [
      { 
        icon: "Sparkles", 
        title: "AI Weekend Planner", 
        description: "Describe your ideal weekend and let our AI create a custom sports itinerary for you." 
      },
      { 
        icon: "Swords", 
        title: "Player Matchmaking", 
        description: "Find other players for a casual game or to complete your team roster." 
      },
      { 
        icon: "Trophy", 
        title: "Events & Tournaments", 
        description: "Discover and join exciting local sports events and compete for glory." 
      },
       { 
        icon: "Wand2", 
        title: "Smart Recommendations", 
        description: "Get personalized facility suggestions based on your preferences and booking history." 
      },
    ];
    const title = "Why Choose Sports Arena?";
    const description = "We offer unique tools and a seamless experience to make your sports life easier and more fun.";
    
    return (
      <section className="py-16 lg:py-24">
        <div className="text-center preserve-3d">
            <h2 className="text-3xl font-bold font-headline">
                {title.split("").map((char, index) => (
                    <span 
                        key={index} 
                        className="inline-block animate-wave" 
                        style={{ animationDelay: `${index * 0.07}s` }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                 {description.split("").map((char, index) => (
                    <span 
                        key={index} 
                        className="inline-block animate-wave" 
                        style={{ animationDelay: `${(title.length + index) * 0.05}s` }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </p>
        </div>
        <div className="mt-12 overflow-hidden [perspective:1000px] [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div className="flex animate-marquee hover:[animation-play-state:paused] w-max">
                {[...features, ...features].map((feature, index) => (
                    <div key={index} className="w-[280px] mx-4 shrink-0">
                        <FeatureCard 
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            index={index}
                        />
                    </div>
                ))}
            </div>
        </div>
      </section>
    );
};

export default function FacilitiesPage() {
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [facilitiesToShow, setFacilitiesToShow] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const { toast } = useToast();

  const cities = useMemo(() => {
      if (allFacilities.length === 0) return [];
      return [...new Set(allFacilities.map(f => f.city))].sort();
  }, [allFacilities]);
  
  const locations = useMemo(() => {
    if (allFacilities.length === 0) return [];
    return [...new Set(allFacilities.map(f => f.location))].sort();
  }, [allFacilities]);

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const [facilitiesData, settingsData] = await Promise.all([
                getFacilitiesAction(),
                getSiteSettingsAction()
            ]);
            
            setCurrency(settingsData.defaultCurrency);
            setAllFacilities(facilitiesData);
        } catch (error) {
            toast({
              title: "Error",
              description: "Could not load facilities data.",
              variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }
    fetchInitialData();
  }, [toast]);

  useEffect(() => {
    let facilitiesToProcess = [...allFacilities];

    if (currentFilters) {
      const filters = currentFilters;
      if (filters.searchTerm) {
        facilitiesToProcess = facilitiesToProcess.filter(f => 
          f.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          f.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }
      if (filters.sport) {
        facilitiesToProcess = facilitiesToProcess.filter(f => f.sports.some(s => s.id === filters.sport));
      }
      if (filters.city) {
          facilitiesToProcess = facilitiesToProcess.filter(f => f.city === filters.city);
      }
      if (filters.location) {
        facilitiesToProcess = facilitiesToProcess.filter(f => f.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.indoorOutdoor) {
        facilitiesToProcess = facilitiesToProcess.filter(f => {
          if (filters.indoorOutdoor === 'indoor') return f.isIndoor === true;
          if (filters.indoorOutdoor === 'outdoor') return f.isIndoor === false;
          return true;
        });
      }
      if (filters.priceRange) {
        facilitiesToProcess = facilitiesToProcess.filter(f => 
          f.sportPrices.some(p => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1])
        );
      }
      if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
        facilitiesToProcess = facilitiesToProcess.filter(f => 
          filters.selectedAmenities!.every(saId => f.amenities.some(fa => fa.id === saId))
        );
      }
      // Filter by operating time if both date and time are selected
      if (filters.date && filters.time) {
        const selectedDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][filters.date.getDay()] as 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
        facilitiesToProcess = facilitiesToProcess.filter(facility => {
            const operatingHoursForDay = facility.operatingHours.find(h => h.day === selectedDay);
            if (!operatingHoursForDay) {
                return false; // Facility is not open on this day
            }
            // Check if selected time is within the facility's open and close times
            return filters.time! >= operatingHoursForDay.open && filters.time! < operatingHoursForDay.close;
        });
      }
    }

    const sorted = sortFacilities(facilitiesToProcess, sortOption);
    setFacilitiesToShow(sorted);

  }, [allFacilities, currentFilters, sortOption]);

  const sortFacilities = (facilities: Facility[], option: SortOption): Facility[] => {
    let sorted = [...facilities];
    switch (option) {
      case 'price-asc':
        sorted.sort((a, b) => Math.min(...(a.sportPrices?.map(p => p.price) || [Infinity])) - Math.min(...(b.sportPrices?.map(p => p.price) || [Infinity])));
        break;
      case 'price-desc':
        sorted.sort((a, b) => Math.min(...(b.sportPrices?.map(p => p.price) || [Infinity])) - Math.min(...(a.sportPrices?.map(p => p.price) || [Infinity])));
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'default':
      default:
        sorted.sort((a,b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || a.name.localeCompare(b.name));
        break;
    }
    return sorted;
  };

  const handleSearch = (filters: SearchFilters) => {
    setCurrentFilters(filters);
  };
  
  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle 
        title="All Sports Facilities"
        description="Browse our comprehensive list of sports venues available in Pune."
      />

      <div className="mb-8">
        <FacilitySearchForm 
          onSearch={handleSearch} 
          currency={currency} 
          facilities={allFacilities}
          cities={cities} 
          locations={locations} 
        />
      </div>

      <div className="flex justify-end items-center mb-6 gap-4">
        {/* Sort Dropdown */}
        <div className="w-full sm:w-auto">
            <Select value={sortOption} onValueChange={(value) => handleSortChange(value as SortOption)}>
                <SelectTrigger className="w-full sm:w-[220px]">
                    <SortAsc className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {facilitiesToShow.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 [perspective:1000px]">
              {facilitiesToShow.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} currency={currency} />
              ))}
            </div>
          ) : (
            <Alert variant="default" className="mt-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Facilities Found</AlertTitle>
              <AlertDescription>
                No facilities match your current search criteria. Try adjusting your filters.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
