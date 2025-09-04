
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { getOpenChallengesAction, createChallengeAction, acceptChallengeAction, getFacilitiesAction, getAllSportsAction } from '@/app/actions';
import type { Challenge, UserProfile, Sport, Facility } from '@/lib/types';
import { PlusCircle, Users, Swords, ThumbsUp, CheckCircle, User, Dices, CalendarDays, BookUser, Building } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, formatDistanceToNow, parseISO, startOfDay } from 'date-fns';
import { getIconComponent } from '@/components/shared/Icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const challengeFormSchema = z.object({
  sportId: z.string({ required_error: "Please select a sport." }),
  facilityId: z.string({ required_error: "Please select a venue." }),
  proposedDate: z.date({ required_error: "Please select a date." }),
  proposedTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Please enter a valid time (HH:MM)." }),
  notes: z.string().min(10, { message: "Please provide a few more details (min 10 characters)." }).max(280, { message: "Notes cannot exceed 280 characters." }),
});

type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

const ChallengeCard = ({ challenge, onAccept, currentUser }: { challenge: Challenge, onAccept: (challengeId: string) => void, currentUser: UserProfile | null }) => {
    const { toast } = useToast();
    if (!currentUser) return null;
    
    const isMyChallenge = challenge.challengerId === currentUser.id;
    const SportIcon = getIconComponent(challenge.sport.iconName) || Dices;
    
    const handleAccept = async () => {
        try {
            await onAccept(challenge.id);
            toast({
                title: 'Challenge Accepted!',
                description: `You have accepted the challenge from ${challenge.challenger.name}.`,
                className: "bg-green-500 text-white",
            });
        } catch (error) {
            toast({
                title: 'Error Accepting Challenge',
                description: error instanceof Error ? error.message : 'An unknown error occurred.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card className="flex flex-col h-full shadow-md">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12 border">
                    <AvatarImage src={challenge.challenger.profilePictureUrl} alt={challenge.challenger.name} />
                    <AvatarFallback>{challenge.challenger.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-lg">{challenge.challenger.name}</CardTitle>
                    <CardDescription className="text-xs">
                        Posted {formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                 <div className="flex items-center gap-2 font-semibold text-md">
                    <SportIcon className="h-5 w-5 text-primary" />
                    <span>Challenge for a game of {challenge.sport.name}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                    <Building className="h-4 w-4"/>
                    Venue: {challenge.facilityName}
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                    <CalendarDays className="h-4 w-4"/> 
                    Proposed for: {format(new Date(challenge.proposedDate), 'MMM d, yyyy @ p')}
                </div>
                <p className="text-sm text-foreground bg-muted/50 p-3 rounded-md border">{challenge.notes}</p>
            </CardContent>
            <CardFooter>
                 <Button className="w-full" onClick={handleAccept} disabled={isMyChallenge}>
                    {isMyChallenge ? <><User className="mr-2 h-4 w-4" />This is your challenge</> 
                        : <><Swords className="mr-2 h-4 w-4" />Accept Challenge</>
                    }
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [sports, setSports] = useState<Sport[]>([]);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: { sportId: '', facilityId: '', proposedTime: '', notes: '' },
  });
  
  useEffect(() => {
    const activeUserStr = sessionStorage.getItem('activeUser');
    if (activeUserStr) {
      setCurrentUser(JSON.parse(activeUserStr));
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
        setIsLoading(true);
        const [facilitiesData, sportsData, challengesData] = await Promise.all([
            getFacilitiesAction(),
            getAllSportsAction(),
            getOpenChallengesAction(),
        ]);
        setAllFacilities(facilitiesData);
        setSports(sportsData);
        setChallenges(challengesData);
        setIsLoading(false);
    };
    fetchInitialData();
  }, []);
  
  const onSubmit = async (data: ChallengeFormValues) => {
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in to issue a challenge.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    const [hours, minutes] = data.proposedTime.split(':').map(Number);
    const combinedDateTime = new Date(data.proposedDate);
    combinedDateTime.setHours(hours, minutes);

    await createChallengeAction({ 
        challengerId: currentUser.id,
        sportId: data.sportId,
        facilityId: data.facilityId,
        notes: data.notes,
        proposedDate: combinedDateTime.toISOString(),
    });
    
    const updatedChallenges = await getOpenChallengesAction();
    setChallenges(updatedChallenges);
    
    toast({
        title: "Challenge Issued!",
        description: "Your challenge is now live for others to accept.",
    });
    form.reset();
    setIsSubmitting(false);
  };

  const handleAcceptChallenge = async (challengeId: string) => {
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in to accept a challenge.", variant: "destructive" });
      return;
    }
    await acceptChallengeAction(challengeId, currentUser.id);
    const updatedChallenges = await getOpenChallengesAction();
    setChallenges(updatedChallenges);
  };

  const filteredChallenges = useMemo(() => {
    if (sportFilter === 'all') return challenges;
    return challenges.filter(req => req.sport.id === sportFilter);
  }, [challenges, sportFilter]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Open Challenges" description="Issue a challenge or accept one from other players." />
      
      <div className="grid lg:grid-cols-3 gap-8 items-start mt-8">
        <Card className="lg:col-span-1 shadow-lg lg:sticky lg:top-24">
            <CardHeader>
                <CardTitle className="flex items-center"><PlusCircle className="mr-2 h-5 w-5 text-primary"/>Issue a Challenge</CardTitle>
                <CardDescription>Let others know you're looking for a match.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="sportId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sport</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a sport" /></SelectTrigger></FormControl>
                                        <SelectContent>{sports.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="facilityId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Venue</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a venue" /></SelectTrigger></FormControl>
                                        <SelectContent>{allFacilities.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="proposedDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                    format(field.value, "PPP")
                                                    ) : (
                                                    <span>Pick a date</span>
                                                    )}
                                                    <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date < startOfDay(new Date())}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="proposedTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time</FormLabel>
                                        <FormControl><Input type="time" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes / Message</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g., 'Friendly match, winner buys coffee!'" {...field} rows={3}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <LoadingSpinner size={20} className="mr-2" /> : <Swords className="mr-2 h-4 w-4" />}
                            {isSubmitting ? 'Posting...' : 'Issue Challenge'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><BookUser className="mr-2 h-5 w-5 text-primary"/>Open Challenge Board</CardTitle>
                    <CardDescription>Browse challenges from other players.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full sm:w-1/2">
                         <Select value={sportFilter} onValueChange={setSportFilter}>
                            <SelectTrigger><SelectValue placeholder="Filter by sport..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sports</SelectItem>
                                {sports.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="text-center py-10"><LoadingSpinner size={36}/></div>
            ) : filteredChallenges.length === 0 ? (
                <Alert>
                    <Swords className="h-4 w-4" />
                    <AlertTitle>No Open Challenges Found</AlertTitle>
                    <AlertDescription>
                        There are no open challenges right now. Why not be the first to issue one?
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredChallenges.map(req => <ChallengeCard key={req.id} challenge={req} onAccept={handleAcceptChallenge} currentUser={currentUser} />)}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
