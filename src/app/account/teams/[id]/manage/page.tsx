
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import { getTeamById, getUserById, removeUserFromTeam, transferCaptaincy, deleteTeam as disbandTeam, mockUser } from '@/lib/data';
import type { Team, UserProfile } from '@/lib/types';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Crown, MoreHorizontal, ShieldAlert, Trash2, UserMinus, UserCog } from 'lucide-react';
import { getIconComponent } from '@/components/shared/Icon';

export default function ManageTeamPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const teamId = params.id as string;

    const [team, setTeam] = useState<Team | null | undefined>(undefined);
    const [members, setMembers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [actionTarget, setActionTarget] = useState<UserProfile | null>(null);
    const [actionType, setActionType] = useState<'remove' | 'promote' | 'disband' | null>(null);

    const fetchTeamData = () => {
        const foundTeam = getTeamById(teamId);
        if (foundTeam) {
            if (foundTeam.captainId !== mockUser.id) {
                // If the user is no longer the captain (e.g., after a transfer), redirect them.
                toast({ title: "No Longer Captain", description: "You have been redirected as you are no longer the team captain.", variant: "destructive" });
                router.push('/account/teams');
                return;
            }
            setTeam(foundTeam);
            const memberProfiles = foundTeam.memberIds.map(id => getUserById(id)).filter(Boolean) as UserProfile[];
            setMembers(memberProfiles);
        } else {
            setTeam(null);
        }
        setIsLoading(false);
    };
    
    useEffect(() => {
        if (teamId) {
            fetchTeamData();
        }
    }, [teamId]);

    const openConfirmationDialog = (type: 'remove' | 'promote' | 'disband', target?: UserProfile) => {
        setActionType(type);
        if (target) {
            setActionTarget(target);
        }
    };

    const closeConfirmationDialog = () => {
        setActionType(null);
        setActionTarget(null);
    };

    const handleConfirmAction = async () => {
        if (!actionType || !team) return;
        setIsSubmitting(true);

        try {
            switch(actionType) {
                case 'remove':
                    if (actionTarget) {
                        removeUserFromTeam(team.id, actionTarget.id, mockUser.id);
                        toast({ title: "Member Removed", description: `${actionTarget.name} has been removed from the team.` });
                    }
                    break;
                case 'promote':
                    if (actionTarget) {
                        transferCaptaincy(team.id, actionTarget.id, mockUser.id);
                        toast({ title: "Captaincy Transferred", description: `You are no longer the captain. ${actionTarget.name} is the new captain.` });
                        // The useEffect will handle the redirect since the current user is no longer the captain.
                    }
                    break;
                case 'disband':
                    disbandTeam(team.id, mockUser.id);
                    toast({ title: "Team Disbanded", description: `The team "${team.name}" has been permanently deleted.`, variant: 'destructive' });
                    router.push('/account/teams');
                    break;
            }
            fetchTeamData(); // Refresh data after action
        } catch (error) {
             toast({ title: "Action Failed", description: error instanceof Error ? error.message : "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
            closeConfirmationDialog();
        }
    };
    
    if (isLoading) {
        return <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size={48} /></div>;
    }

    if (!team) {
        notFound();
    }
    
    const SportIcon = getIconComponent(team.sport.iconName);

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-3xl">
            <Link href="/account/teams" className="mb-6 inline-block">
                <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Back to My Teams</Button>
            </Link>
            <PageTitle title={`Manage: ${team.name}`} description={`Manage members and settings for your ${team.sport.name} team.`} />

            <div className="space-y-8 mt-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Team Roster ({members.length})</CardTitle>
                        <CardDescription>View and manage your team members.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {members.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 border-2">
                                            <AvatarImage src={member.profilePictureUrl} alt={member.name} />
                                            <AvatarFallback>{member.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{member.name}</span>
                                        {member.id === team.captainId && <Crown className="h-5 w-5 text-yellow-500" title="Captain" />}
                                    </div>
                                    {member.id !== team.captainId && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openConfirmationDialog('promote', member)}>
                                                    <UserCog className="mr-2 h-4 w-4"/> Make Captain
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openConfirmationDialog('remove', member)}>
                                                    <UserMinus className="mr-2 h-4 w-4"/> Remove from Team
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-destructive/50">
                     <CardHeader>
                        <CardTitle className="flex items-center text-destructive"><ShieldAlert className="mr-2 h-5 w-5"/>Danger Zone</CardTitle>
                        <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" onClick={() => openConfirmationDialog('disband')}>
                            <Trash2 className="mr-2 h-4 w-4"/> Disband Team
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={actionType !== null} onOpenChange={(open) => !open && closeConfirmationDialog()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {actionType === 'remove' && `This will permanently remove ${actionTarget?.name} from your team.`}
                            {actionType === 'promote' && `This will transfer captaincy to ${actionTarget?.name}. You will lose all captain permissions for this team.`}
                            {actionType === 'disband' && `This will permanently delete the team "${team.name}" for all members. This action cannot be undone.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmAction} 
                            disabled={isSubmitting}
                            className={actionType === 'disband' ? 'bg-destructive hover:bg-destructive/90' : ''}
                        >
                            {isSubmitting ? <LoadingSpinner size={16} /> : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

