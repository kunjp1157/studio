
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
import { getOpenLfgRequests, createLfgRequest, expressInterestInLfg, getUserById, getSportById } from '@/lib/data';
import { getFacilitiesAction } from '@/app/actions';
import { getMockSports } from '@/lib/mock-data';
import type { LfgRequest, UserProfile, Sport, SkillLevel, Facility } from '@/lib/types';
import { PlusCircle, Users, Swords, ThumbsUp, CheckCircle, User, Dices, BarChart, Clock, Users2, Building } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { getIconComponent } from '@/components/shared/Icon';

const lfgFormSchema = z.object({
  sportId: z.string({ required_error: "Please select a sport." }),
  facilityId: z.string({ required_error: "Please select a venue." }),
  skillLevel: z.enum(['Any', 'Beginner', 'Intermediate', 'Advanced']).default('Any'),
  playersNeeded: z.coerce.number().int().min(1, "Must need at least 1 player").optional(),
  preferredTime: z.string().max(50, "Keep it brief!").optional(),
  notes: z.string().min(10, { message: "Please provide a few more details (min 10 characters)." }).max(280, { message: "Notes cannot exceed 280 characters." }),
});

type LfgFormValues = z.infer<typeof lfgFormSchema>;

const LfgRequestCard = ({ request, onInterest }: { request: LfgRequest, onInterest: (lfgId: string) => void }) => {
    const user = getUserById(request.userId);
    const sport = getSportById(request.sportId);
    const isMyPost = request.userId === mockUser.id;
    const alreadyInterested = request.interestedUserIds.includes(mockUser.id);
    
    if (!user || !sport) return null;

    const SportIcon = getIconComponent(sport.iconName) || Dices;
    
    const UserHeader = () => (
        <div className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12 border">
                <AvatarImage src={user.profilePictureUrl} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <CardDescription className="text-xs">
                    Posted {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                </CardDescription>
            </div>
        </div>
    );

    return (
        <Card className="flex flex-col h-full shadow-md">
            <CardHeader>
                {user.isProfilePublic ? (
                    <Link href={`/users/${user.id}`} className="hover:opacity-80 transition-opacity">
                        <UserHeader />
                    </Link>
                ) : (
                    <UserHeader />
                )}
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <div className="flex items-center gap-2 font-semibold text-md">
                    <SportIcon className="h-5 w-5 text-primary" />
                    <span>Looking for a game of {sport.name}</span>
                </div>
                 <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                    <Building className="h-4 w-4"/>
                    Venue: {request.facilityName}
                </div>
                <div className="space-y-1.5">
                    {request.skillLevel && request.skillLevel !== 'Any' && (
                        <div className="flex items-center text-xs text-muted-foreground gap-1.5"><BarChart className="h-3 w-3"/> Skill Level: {request.skillLevel}</div>
                    )}
                    {request.playersNeeded && (
                        <div className="flex items-center text-xs text-muted-foreground gap-1.5"><Users2 className="h-3 w-3"/> Players Needed: {request.playersNeeded}</div>
                    )}
                    {request.preferredTime && (
                        <div className="flex items-center text-xs text-muted-foreground gap-1.5"><Clock className="h-3 w-3"/> Preferred Time: {request.preferredTime}</div>
                    )}
                </div>

                <p className="text-sm text-foreground bg-muted/50 p-3 rounded-md border">{request.notes}</p>
                 
                {request.interestedUserIds.length > 0 && (
                    <div className="flex items-center gap-2 pt-2">
                        <TooltipProvider>
                            <div className="flex -space-x-2">
                                {request.interestedUserIds.slice(0,5).map(userId => {
                                    const interestedUser = getUserById(userId);
                                    if (!interestedUser) return null;
                                    return (
                                        <Tooltip key={userId}>
                                            <TooltipTrigger>
                                                <Avatar className="h-7 w-7 border-2 border-background">
                                                    <AvatarImage src={interestedUser.profilePictureUrl} alt={interestedUser.name}/>
                                                    <AvatarFallback>{interestedUser.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent>{interestedUser.name}</TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </TooltipProvider>
                        <span className="text-xs font-medium text-muted-foreground">
                            {request.interestedUserIds.length} player(s) interested
                        </span>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button className="w-full" onClick={() => onInterest(request.id)} disabled={isMyPost || alreadyInterested}>
                    {isMyPost ? <><User className="mr-2 h-4 w-4" />This is your post</> 
                        : alreadyInterested ? <><CheckCircle className="mr-2 h-4 w-4" />You're interested!</> 
                        : <><ThumbsUp className="mr-2 h-4 w-4" />I'm Interested!</>
                    }
                </Button>
            </CardFooter>
        </Card>
    );
};


export default function MatchmakingPage() {
  const [requests, setRequests] = useState<LfgRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const { toast } = useToast();

  const form = useForm<LfgFormValues>({
    resolver: zodResolver(lfgFormSchema),
    defaultValues: { sportId: '', facilityId: '', skillLevel: 'Any', playersNeeded: undefined, preferredTime: '', notes: '' },
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchFacilities = async () => {
        const facilitiesData = await getFacilitiesAction();
        setAllFacilities(facilitiesData);
    };
    fetchFacilities();
    setTimeout(() => {
      setRequests(getOpenLfgRequests());
      setIsLoading(false);
    }, 300);
  }, []);
  
  const onSubmit = async (data: LfgFormValues) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 700));
    const updatedRequests = createLfgRequest({ ...data, userId: mockUser.id });
    setRequests(updatedRequests);
    toast({
        title: "Post Created!",
        description: "Your 'Looking for Game' post is now live.",
    });
    form.reset();
    setIsSubmitting(false);
  };

  const handleInterest = (lfgId: string) => {
    const updatedRequests = expressInterestInLfg(lfgId, mockUser.id);
    setRequests(updatedRequests);
    toast({
        title: "Interest Expressed!",
        description: "The post creator has been notified.",
    });
  };

  const filteredRequests = useMemo(() => {
    if (sportFilter === 'all') return requests;
    return requests.filter(req => req.sportId === sportFilter);
  }, [requests, sportFilter]);
  
  const mockSports = getMockSports();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Player Matchmaking" description="Find players for a game or post your own request to build a squad." />
      
      <div className="grid lg:grid-cols-3 gap-8 items-start mt-8">
        <Card className="lg:col-span-1 shadow-lg lg:sticky lg:top-24">
            <CardHeader>
                <CardTitle className="flex items-center"><PlusCircle className="mr-2 h-5 w-5 text-primary"/>Create a Post</CardTitle>
                <CardDescription>Let others know you're looking for a game.</CardDescription>
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
                                        <SelectContent>{mockSports.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
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
                                name="skillLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Skill Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Any">Any</SelectItem>
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="playersNeeded"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Players Needed</FormLabel>
                                        <FormControl><Input type="number" min="1" placeholder="e.g., 3" {...field} value={field.value ?? ''} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="preferredTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preferred Time</FormLabel>
                                    <FormControl><Input placeholder="e.g., Weekend afternoons" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g., 'Looking for a friendly but competitive game...'" {...field} rows={3}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <LoadingSpinner size={20} className="mr-2" /> : <Swords className="mr-2 h-4 w-4" />}
                            {isSubmitting ? 'Posting...' : 'Post Request'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Find a Game</CardTitle>
                    <CardDescription>Browse posts from other players looking for a game.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full sm:w-1/2">
                         <Select value={sportFilter} onValueChange={setSportFilter}>
                            <SelectTrigger><SelectValue placeholder="Filter by sport..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sports</SelectItem>
                                {mockSports.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="text-center py-10"><LoadingSpinner size={36}/></div>
            ) : filteredRequests.length === 0 ? (
                <Alert>
                    <Users className="h-4 w-4" />
                    <AlertTitle>No Open Requests Found</AlertTitle>
                    <AlertDescription>
                        There are no matching 'Looking for Game' posts right now. Why not create one?
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredRequests.map(req => <LfgRequestCard key={req.id} request={req} onInterest={handleInterest}/>)}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
