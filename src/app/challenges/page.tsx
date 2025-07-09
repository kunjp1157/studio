
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
import { mockUser, getOpenChallenges, createChallenge, acceptChallenge, mockSports, getUserById, getSportById } from '@/lib/data';
import type { Challenge, UserProfile, Sport } from '@/lib/types';
import { PlusCircle, Users, Swords, ThumbsUp, CheckCircle, User, Dices, CalendarDays, BookUser } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { getIconComponent } from '@/components/shared/Icon';

const challengeFormSchema = z.object({
  sportId: z.string({ required_error: "Please select a sport." }),
  proposedDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Please select a valid date and time." }),
  notes: z.string().min(10, { message: "Please provide a few more details (min 10 characters)." }).max(280, { message: "Notes cannot exceed 280 characters." }),
});

type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

const ChallengeCard = ({ challenge, onAccept }: { challenge: Challenge, onAccept: (challengeId: string) => void }) => {
    const { toast } = useToast();
    const isMyChallenge = challenge.challengerId === mockUser.id;
    const SportIcon = getIconComponent(challenge.sport.iconName) || Dices;
    
    const handleAccept = () => {
        try {
            onAccept(challenge.id);
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
                    <CalendarDays className="h-4 w-4"/> 
                    Proposed for: {format(parseISO(challenge.proposedDate), 'MMM d, yyyy @ p')}
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
  const { toast } = useToast();

  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: { sportId: '', proposedDate: '', notes: '' },
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setChallenges(getOpenChallenges());
      setIsLoading(false);
    }, 300);
  }, []);
  
  const onSubmit = async (data: ChallengeFormValues) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 700));
    const updatedChallenges = createChallenge({ ...data, challengerId: mockUser.id });
    setChallenges(updatedChallenges);
    toast({
        title: "Challenge Issued!",
        description: "Your challenge is now live for others to accept.",
    });
    form.reset();
    setIsSubmitting(false);
  };

  const handleAcceptChallenge = (challengeId: string) => {
    const updatedChallenges = acceptChallenge(challengeId, mockUser.id);
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
                                        <SelectContent>{mockSports.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="proposedDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proposed Date & Time</FormLabel>
                                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                {mockSports.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
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
                    {filteredChallenges.map(req => <ChallengeCard key={req.id} challenge={req} onAccept={handleAcceptChallenge}/>)}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
