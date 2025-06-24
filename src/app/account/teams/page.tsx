
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Team, UserProfile } from '@/lib/types';
import { mockUser, getTeamsByUserId, getUserById, leaveTeam as mockLeaveTeam } from '@/lib/data';
import { Users, PlusCircle, Crown, User, LogOut, Settings, AlertCircle, Zap } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function MyTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { toast } = useToast();

  const fetchTeams = () => {
    const userTeams = getTeamsByUserId(mockUser.id);
    setTeams(userTeams);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      fetchTeams();
      setIsLoading(false);
    }, 500);
  }, []);

  const handleLeaveTeam = (teamId: string, teamName: string) => {
    setIsActionLoading(true);
    setTimeout(() => {
        const success = mockLeaveTeam(teamId, mockUser.id);
        if (success) {
            toast({
                title: "You have left the team",
                description: `You are no longer a member of ${teamName}.`
            });
            fetchTeams(); // Refresh the list
        } else {
             toast({
                title: "Error Leaving Team",
                description: "You cannot leave the team if you are the captain and other members remain. Please transfer captaincy first.",
                variant: "destructive"
            });
        }
        setIsActionLoading(false);
    }, 1000);
  };
  
  const MemberAvatar = ({ member, teamCaptainId }: { member: UserProfile, teamCaptainId: string }) => (
      <Tooltip>
          <TooltipTrigger asChild>
              <Avatar className="h-9 w-9 border-2 border-background">
                  <AvatarImage src={member.profilePictureUrl} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
              </Avatar>
          </TooltipTrigger>
          <TooltipContent>
              <p>{member.name}</p>
              {member.id === teamCaptainId && <p className="text-xs text-muted-foreground">Captain</p>}
          </TooltipContent>
      </Tooltip>
  );

  const TeamCard = ({ team }: { team: Team }) => {
    const members = team.memberIds.map(id => getUserById(id)).filter(Boolean) as UserProfile[];
    const isCaptain = mockUser.id === team.captainId;
    const SportIcon = team.sport.icon || Zap;

    return (
        <Card className="flex flex-col h-full shadow-lg">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-headline">{team.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                            <SportIcon className="mr-2 h-4 w-4 text-primary" /> {team.sport.name}
                        </CardDescription>
                    </div>
                    {isCaptain && <Badge variant="secondary" className="flex items-center gap-1"><Crown className="h-3 w-3 text-yellow-500"/> Captain</Badge>}
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <h4 className="font-semibold text-sm mb-2">Members ({members.length})</h4>
                <div className="flex flex-wrap gap-2">
                    <TooltipProvider>
                    {members.map(member => (
                       member.isProfilePublic ? (
                            <Link key={member.id} href={`/users/${member.id}`} passHref>
                                <a aria-label={`View profile of ${member.name}`}>
                                    <MemberAvatar member={member} teamCaptainId={team.captainId} />
                                </a>
                            </Link>
                        ) : (
                            <MemberAvatar key={member.id} member={member} teamCaptainId={team.captainId} />
                        )
                    ))}
                    </TooltipProvider>
                </div>
            </CardContent>
            <CardFooter className="space-x-2">
                 <Button variant="outline" size="sm" onClick={() => toast({ title: "Coming Soon!", description: "Team management features are on the way."})}>
                    <Settings className="mr-1 h-4 w-4" /> Manage
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isActionLoading}><LogOut className="mr-1 h-4 w-4" /> Leave</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Leave "{team.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to leave this team? If you are the captain of a team with other members, you must transfer captaincy before leaving.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Stay on Team</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleLeaveTeam(team.id, team.name)} disabled={isActionLoading}>
                                {isActionLoading ? <LoadingSpinner size={16} /> : "Yes, Leave Team"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
  };

  if (isLoading) {
    return <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size={48} /></div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <PageTitle title="My Teams" description="Manage your teams, view members, and create new squads." className="mb-0"/>
            <Link href="/account/teams/new">
                <Button size="lg"><PlusCircle className="mr-2 h-5 w-5"/> Create New Team</Button>
            </Link>
       </div>

      {teams.length === 0 ? (
        <Alert>
            <Users className="h-4 w-4" />
            <AlertTitle>No Teams Yet!</AlertTitle>
            <AlertDescription>
            You are not part of any team. Why not create one and invite your friends?
            <Link href="/account/teams/new">
                <Button className="mt-4">Create a Team</Button>
            </Link>
            </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => <TeamCard key={team.id} team={team} />)}
        </div>
      )}
    </div>
  );
}
