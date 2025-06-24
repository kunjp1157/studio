
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound, useRouter } from 'next/navigation';
import type { SportEvent, Facility, SiteSettings } from '@/lib/types';
import { getEventById, getFacilityById, registerForEvent as mockRegisterForEvent, addNotification, mockUser } from '@/lib/data';
import { getSiteSettingsAction } from '@/app/actions';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CalendarDays, MapPin, Users, Ticket, ArrowLeft, Clock, Building, Zap, ShieldCheck, Info, DollarSign as FeeIcon } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const eventId = params.id as string;
  const [event, setEvent] = useState<SportEvent | null | undefined>(undefined);
  const [facility, setFacility] = useState<Facility | null | undefined>(undefined);
  const [isRegistering, setIsRegistering] = useState(false);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  useEffect(() => {
    if (eventId) {
      const foundEvent = getEventById(eventId);
      setTimeout(() => { // Simulate fetch delay
        setEvent(foundEvent || null);
        if (foundEvent) {
          const foundFacility = getFacilityById(foundEvent.facilityId);
          setFacility(foundFacility || null);
        }
      }, 300);
    }
  }, [eventId]);
  
  useEffect(() => {
    const fetchSettings = async () => {
      const currentSettings = await getSiteSettingsAction();
      setCurrency(prev => currentSettings.defaultCurrency !== prev ? currentSettings.defaultCurrency : prev);
    };

    fetchSettings();
    const settingsInterval = setInterval(fetchSettings, 5000);

    return () => clearInterval(settingsInterval);
  }, []);

  const handleRegisterClick = async () => {
    if (!event) return;
    setIsRegistering(true);
    
    // Simulate API call for registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = mockRegisterForEvent(event.id);

    if (success) {
      toast({
          title: "Registration Successful!",
          description: `You've been registered for "${event.name}".`,
          className: "bg-green-500 text-white",
      });
      // Update local event state to reflect new participant count
      setEvent(prev => prev ? {...prev, registeredParticipants: prev.registeredParticipants + 1} : null);
      addNotification(mockUser.id, {
        type: 'general', // Or a new 'event_registration' type
        title: 'Event Registration Confirmed',
        message: `You are now registered for ${event.name}.`,
        link: `/events/${event.id}`,
      });
    } else {
        toast({
            title: "Registration Failed",
            description: `Could not register for "${event.name}". It might be full or an error occurred.`,
            variant: "destructive",
        });
    }
    setIsRegistering(false);
  };

  if (event === undefined) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  const SportIcon = event.sport.icon || Zap;
  const isEventPastStatus = isPast(parseISO(event.endDate));
  const isEventFull = event.maxParticipants && event.registeredParticipants >= event.maxParticipants;
  const canRegister = !isEventPastStatus && !isEventFull;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
      <Button variant="outline" onClick={() => router.push('/events')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
      </Button>

      <Card className="shadow-xl overflow-hidden">
        {event.imageUrl && (
          <div className="relative aspect-video md:h-[400px] w-full">
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
              data-ai-hint={event.imageDataAiHint || "sports event banner"}
            />
          </div>
        )}
        <CardHeader className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <PageTitle title={event.name} className="mb-0" />
            <div className="flex gap-2 items-center mt-2 md:mt-0 shrink-0">
              {isEventPastStatus && <Badge variant="secondary">Event Concluded</Badge>}
              {isEventFull && !isEventPastStatus && <Badge variant="destructive">Event Full</Badge>}
              {!isEventFull && !isEventPastStatus && <Badge variant="default" className="bg-green-500 hover:bg-green-600">Registrations Open</Badge>}
            </div>
          </div>
          <div className="flex items-center text-muted-foreground mt-2">
            <SportIcon className="w-5 h-5 mr-2 text-primary" />
            <span className="text-lg font-medium">{event.sport.name} Event</span>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6 text-md">
            <div className="space-y-3">
              <div className="flex items-start">
                <CalendarDays className="w-5 h-5 mr-3 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold">Date & Time</p>
                  <p className="text-muted-foreground">
                    {format(parseISO(event.startDate), 'EEE, MMM d, yyyy, p')}
                    {' - '}
                    {format(parseISO(event.endDate), 'EEE, MMM d, yyyy, p')}
                  </p>
                </div>
              </div>
              {facility && (
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <Link href={`/facilities/${facility.id}`} className="text-primary hover:underline">
                      {facility.name}
                    </Link>
                    <p className="text-muted-foreground text-sm">{facility.address}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <Users className="w-5 h-5 mr-3 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold">Participants</p>
                  <p className="text-muted-foreground">
                    {event.registeredParticipants} Registered
                    {event.maxParticipants ? ` / ${event.maxParticipants} Spots` : ' (Open Participation)'}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FeeIcon className="w-5 h-5 mr-3 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold">Entry Fee</p>
                  <p className="text-muted-foreground">
                    {event.entryFee !== undefined && currency ? (event.entryFee > 0 ? formatCurrency(event.entryFee, currency) : 'Free Entry') : <Skeleton className="h-5 w-20" />}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center"><Info className="mr-2 h-5 w-5 text-primary" />About this Event</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 p-4 rounded-md text-foreground">
                 <p>{event.description}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 border-t">
          <Button 
            size="lg" 
            className="w-full md:w-auto" 
            onClick={handleRegisterClick}
            disabled={!canRegister || isRegistering}
          >
            {isRegistering ? <LoadingSpinner size={20} className="mr-2" /> : <Ticket className="mr-2 h-5 w-5" />}
            {isRegistering ? 'Registering...' : (isEventPastStatus ? 'Event Ended' : (isEventFull ? 'Registration Full' : 'Register for Event'))}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
