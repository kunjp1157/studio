
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import type { UserProfile, Sport, Achievement, UserSkill } from '@/lib/types';
import { getUserById, getSportById } from '@/lib/data';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Award, Gem, Heart, Medal, UserCircle, Shield, ShieldCheck, Dumbbell, Zap, Swords, AlertCircle, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { getIconComponent } from '@/components/shared/Icon';

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserProfile | null | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      setTimeout(() => { // Simulate fetch
        const foundUser = getUserById(userId);
        setUser(foundUser || null);
      }, 300);
    }
  }, [userId]);

  if (user === undefined) {
    return <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size={48} /></div>;
  }
  
  if (!user) {
    notFound();
  }

  if (!user.isProfilePublic) {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-2xl text-center">
            <Shield className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <PageTitle title="Profile is Private" description="This user has chosen to keep their profile private."/>
            <Link href="/facilities">
                <Button variant="outline" className="mt-4"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Facilities</Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
       <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-6 space-y-4 sm:space-y-0">
                        <Avatar className="h-28 w-28 border-4 border-primary shadow-md">
                            <AvatarImage src={user.profilePictureUrl} alt={user.name} data-ai-hint={user.dataAiHint || "user avatar"} />
                            <AvatarFallback className="text-4xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                            <CardTitle className="text-4xl font-headline">{user.name}</CardTitle>
                            <CardDescription className="flex items-center justify-center sm:justify-start text-base mt-2">
                                <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" /> 
                                Member Since {format(new Date(user.joinedAt), 'MMMM yyyy')}
                            </CardDescription>
                             <div className="mt-4 flex gap-2 justify-center sm:justify-start">
                                <Button onClick={() => toast({title: "Coming Soon!", description: "Messaging feature is under development."})}>
                                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                                </Button>
                                <Button variant="outline" onClick={() => toast({title: "Coming Soon!", description: "Team invitation feature is under development."})}>
                                    <Swords className="mr-2 h-4 w-4" /> Invite to Team
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                 {user.bio && (
                    <CardContent>
                        <Separator className="my-4"/>
                        <p className="text-muted-foreground italic text-center">"{user.bio}"</p>
                    </CardContent>
                )}
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Heart className="mr-2 h-5 w-5 text-primary"/>Preferred Sports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.preferredSports && user.preferredSports.length > 0 ? (
                             <ul className="space-y-2">
                                {user.preferredSports.map(sport => {
                                    const SportIcon = getIconComponent(sport.iconName) || Zap;
                                    return (
                                        <li key={sport.id} className="flex items-center text-foreground">
                                            <SportIcon className="mr-2 h-5 w-5 text-primary"/> {sport.name}
                                        </li>
                                    )
                                })}
                             </ul>
                        ) : <p className="text-sm text-muted-foreground">No preferred sports listed.</p>}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Dumbbell className="mr-2 h-5 w-5 text-primary"/>Skill Levels</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {user.skillLevels && user.skillLevels.length > 0 ? (
                             <ul className="space-y-2">
                                {user.skillLevels.map(skill => (
                                    <li key={skill.sportId} className="flex items-center justify-between text-foreground">
                                        <span>{skill.sportName}</span>
                                        <span className="font-semibold text-primary">{skill.level}</span>
                                    </li>
                                ))}
                             </ul>
                        ) : <p className="text-sm text-muted-foreground">No skill levels specified.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><Gem className="mr-2 h-6 w-6 text-primary" /> Loyalty Points</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <p className="text-6xl font-bold text-primary">{user.loyaltyPoints || 0}</p>
                        <p className="text-muted-foreground mt-1">Points Earned</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><Award className="mr-2 h-6 w-6 text-yellow-500" /> Achievements</CardTitle>
                    <CardDescription>Badges earned on their sports journey.</CardDescription>
                </CardHeader>
                <CardContent>
                    {user.achievements && user.achievements.length > 0 ? (
                        <TooltipProvider>
                        <ul className="grid grid-cols-4 gap-4">
                            {user.achievements.map(ach => {
                                const AchievementIcon = getIconComponent(ach.iconName) || Medal;
                                return (
                                    <li key={ach.id} className="flex flex-col items-center text-center">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className={`p-3 rounded-full border-2 ${ach.unlockedAt ? 'border-yellow-500 bg-yellow-500/10' : 'border-muted bg-muted/50'}`}>
                                                <AchievementIcon className={`h-8 w-8 ${ach.unlockedAt ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-semibold">{ach.name}</p>
                                            <p className="text-xs text-muted-foreground">{ach.description}</p>
                                            {ach.unlockedAt && <p className="text-xs text-muted-foreground">Unlocked: {format(new Date(ach.unlockedAt), 'MMM d, yyyy')}</p>}
                                        </TooltipContent>
                                    </Tooltip>
                                    <span className={`mt-1.5 text-xs font-medium text-center ${ach.unlockedAt ? 'text-foreground' : 'text-muted-foreground'}`}>{ach.name}</span>
                                    </li>
                                );
                            })}
                        </ul>
                        </TooltipProvider>
                    ) : (
                        <p className="text-muted-foreground text-sm text-center py-4">No achievements unlocked yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
       </div>
    </div>
  );
}
