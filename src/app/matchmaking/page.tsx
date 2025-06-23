
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { mockUser, getOpenLfgRequests, createLfgRequest, expressInterestInLfg, mockSports, getUserById, getSportById } from '@/lib/data';
import type { LfgRequest, UserProfile, Sport } from '@/lib/types';
import { PlusCircle, Users, Swords, ThumbsUp, CheckCircle, User, Dices } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';

const lfgFormSchema = z.object({
  sportId: z.string({ required_error: "Please select a sport." }),
  notes: z.string().min(10, { message: "Please provide a few more details (min 10 characters)." }).max(280, { message: "Notes cannot exceed 280 characters." }),
});

type LfgFormValues = z.infer<typeof lfgFormSchema>;

const LfgRequestCard = ({ request, onInterest }: { request: LfgRequest, onInterest: (lfgId: string) => void }) => {
    const user = getUserById(request.userId);
    const sport = getSportById(request.sportId);
    const isMyPost = request.userId === mockUser.id;
    const alreadyInterested = request.interestedUserIds.includes(mockUser.id);
    
    if (!user || !sport) return null;

    const SportIcon = sport.icon || Dices;
    
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
                <div className="flex items-center gap-2 font-semibold">
                    <SportIcon className="h-5 w-5 text-primary" />
                    <span>Looking for a game of {sport.name}</span>
                </div>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border">{request.notes}</p>
                 {request.interestedUserIds.length > 0 && (
                    <div className="text-xs">
                        <span className="font-semibold">{request.interestedUserIds.length} player(s) interested.</span>
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
  const { toast } = useToast();

  const form = useForm<LfgFormValues>({
    resolver: zodResolver(lfgFormSchema),
    defaultValues: { sportId: '', notes: '' },
  });

  const fetchRequests = () => {
    setRequests(getOpenLfgRequests());
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      fetchRequests();
      setIsLoading(false);
    }, 300);
  }, []);
  
  const onSubmit = async (data: LfgFormValues) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 700));
    createLfgRequest({ ...data, userId: mockUser.id });
    toast({
        title: "Post Created!",
        description: "Your 'Looking for Game' post is now live.",
    });
    fetchRequests();
    form.reset();
    setIsSubmitting(false);
  };

  const handleInterest = async (lfgId: string) => {
    expressInterestInLfg(lfgId, mockUser.id);
    toast({
        title: "Interest Expressed!",
        description: "The post creator has been notified.",
    });
    fetchRequests();
  };

  const filteredRequests = useMemo(() => {
    if (sportFilter === 'all') return requests;
    return requests.filter(req => req.sportId === sportFilter);
  }, [requests, sportFilter]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Player Matchmaking" description="Find players for a game or post your own request to build a squad." />
      
      <div className="grid lg:grid-cols-3 gap-8 items-start">
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
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g., 'Looking for 3 more players for a 5v5 game at Grand City Arena this Saturday afternoon...'" {...field} rows={4}/>
                                    </FormControl>
                                     <FormDescription>Mention skill level, location preference, etc.</FormDescription>
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
