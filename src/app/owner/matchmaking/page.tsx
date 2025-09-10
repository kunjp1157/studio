
'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import type { UserProfile, LfgRequest, Challenge, Sport } from '@/lib/types';
import { getFacilitiesByOwnerIdAction, getLfgRequestsByFacilityIdsAction, getChallengesByFacilityIdsAction, getUsersAction } from '@/app/actions';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Swords, Dices } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getIconComponent } from '@/components/shared/Icon';
import Link from 'next/link';

export default function OwnerMatchmakingPage() {
  const [lfgRequests, setLfgRequests] = useState<LfgRequest[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
      setCurrentUser(JSON.parse(activeUser));
    }
  }, []);

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const ownerFacilities = await getFacilitiesByOwnerIdAction(currentUser.id);
        const facilityIds = ownerFacilities.map(f => f.id);
        
        const [ownerLfg, ownerChallenges, usersData] = await Promise.all([
          getLfgRequestsByFacilityIdsAction(facilityIds),
          getChallengesByFacilityIdsAction(facilityIds),
          getUsersAction()
        ]);

        setAllUsers(usersData);
        setLfgRequests(ownerLfg.sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()));
        setChallenges(ownerChallenges.sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()));

      } catch (error) {
        toast({ title: "Error", description: "Could not fetch matchmaking data for your facilities.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwnerData();
  }, [currentUser, toast]);

  const getUserName = (userId: string) => {
    return allUsers.find(u => u.id === userId)?.name || 'Unknown User';
  }

  const getSportFromChallenge = (challenge: Challenge): Sport => {
    return challenge.sport;
  }

  return (
    <div className="space-y-8">
      <PageTitle title="Facility Matchmaking" description="View 'Looking for Game' requests and challenges posted for your venues." />
      
      <Tabs defaultValue="lfg">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lfg"><Dices className="mr-2 h-4 w-4"/> Looking for Game</TabsTrigger>
          <TabsTrigger value="challenges"><Swords className="mr-2 h-4 w-4"/> Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="lfg">
          <Card>
            <CardHeader>
              <CardTitle>Looking for Game Posts</CardTitle>
              <CardDescription>Players looking for others to join them at your facilities.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[150px]"><LoadingSpinner /></div>
              ) : lfgRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No 'Looking for Game' requests for your facilities.</p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Facility</TableHead><TableHead>Sport</TableHead><TableHead>Posted</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {lfgRequests.map((req) => {
                        return (
                          <TableRow key={req.id}>
                            <TableCell>{getUserName(req.userId)}</TableCell>
                            <TableCell>{req.facilityName}</TableCell>
                            <TableCell>{req.sportId}</TableCell>
                            <TableCell>{format(parseISO(req.createdAt), 'MMM d, yyyy')}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="challenges">
           <Card>
            <CardHeader>
              <CardTitle>Open Challenges</CardTitle>
              <CardDescription>Players issuing open challenges to others at your facilities.</CardDescription>
            </CardHeader>
            <CardContent>
               {isLoading ? (
                <div className="flex justify-center items-center min-h-[150px]"><LoadingSpinner /></div>
              ) : challenges.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No challenges have been issued for your facilities.</p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader><TableRow><TableHead>Challenger</TableHead><TableHead>Facility</TableHead><TableHead>Sport</TableHead><TableHead>Date Proposed</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {challenges.map((challenge) => {
                        const sport = getSportFromChallenge(challenge);
                        return (
                        <TableRow key={challenge.id}>
                          <TableCell>{challenge.challenger.name}</TableCell>
                          <TableCell>{challenge.facilityName}</TableCell>
                          <TableCell>{sport?.name || 'Unknown Sport'}</TableCell>
                          <TableCell>{format(new Date(challenge.proposedDate), 'MMM d, p')}</TableCell>
                        </TableRow>
                      )})}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
