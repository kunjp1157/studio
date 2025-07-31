
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUser, getAllUsers } from '@/lib/data';
import type { UserProfile } from '@/lib/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Trophy, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
        setIsLoading(true);
        try {
            const users = await getAllUsers();
            // Filter out suspended users and sort by loyalty points
            const sortedUsers = users
                .filter(u => u.status === 'Active')
                .sort((a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0));
            setLeaderboard(sortedUsers);
        } catch (error) {
            console.error("Failed to load leaderboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchLeaderboard();
  }, []);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-yellow-700'; // Bronze color
    return 'text-muted-foreground';
  };

  const PlayerInfo = ({ user, isCurrentUser }: { user: UserProfile, isCurrentUser: boolean }) => (
    <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border">
            <AvatarImage src={user.profilePictureUrl} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            {isCurrentUser && <span className="text-xs text-primary font-semibold">You</span>}
        </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <PageTitle title="Leaderboard" description="See who's leading the charts in loyalty points!" />
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Leaderboard" description="See who's leading the charts in loyalty points!" />

      <Card className="shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-primary" />
            Top Players by Loyalty Points
          </CardTitle>
          <CardDescription>
            Earn points by booking facilities, writing reviews, and participating in events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Loyalty Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((user, index) => {
                  const rank = index + 1;
                  const isCurrentUser = user.id === mockUser.id;
                  return (
                    <TableRow key={user.id} className={cn(isCurrentUser && 'bg-primary/10')}>
                      <TableCell className="text-center font-bold text-lg">
                        <span className={cn(getRankColor(rank))}>{rank}</span>
                      </TableCell>
                      <TableCell>
                        {user.isProfilePublic ? (
                          <Link href={`/users/${user.id}`} className="hover:underline">
                            <PlayerInfo user={user} isCurrentUser={isCurrentUser} />
                          </Link>
                        ) : (
                          <PlayerInfo user={user} isCurrentUser={isCurrentUser} />
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-lg text-primary">
                        <div className="flex items-center justify-end gap-1.5">
                            <Gem className="h-4 w-4 text-yellow-500" />
                            {(user.loyaltyPoints || 0).toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
