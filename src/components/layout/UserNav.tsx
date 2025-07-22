
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, LayoutDashboard, CalendarDays, CreditCard, Heart, Group, HandCoins } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { useState, useEffect } from 'react';


export function UserNav() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On the client, read the user from sessionStorage.
    const storedUser = sessionStorage.getItem('activeUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);

    // Listen for changes from the UserSwitcher component
    const handleUserChange = () => {
        const updatedUser = sessionStorage.getItem('activeUser');
        if(updatedUser) {
            setCurrentUser(JSON.parse(updatedUser));
        }
    };
    window.addEventListener('userChanged', handleUserChange);

    return () => {
        window.removeEventListener('userChanged', handleUserChange);
    };

  }, []);

  const handleLogout = () => {
    // "Logout" is now just a navigation action as there's no auth session.
    router.push('/facilities');
  };

  if (isLoading || !currentUser) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.profilePictureUrl} alt={currentUser.name} />
            <AvatarFallback>
              {currentUser.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/bookings">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>My Bookings</span>
            </Link>
          </DropdownMenuItem>
           <DropdownMenuItem asChild>
            <Link href="/account/favorites">
              <Heart className="mr-2 h-4 w-4" />
              <span>My Favorites</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/teams">
              <Group className="mr-2 h-4 w-4" />
              <span>My Teams</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/payment-methods">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Payment Methods</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {currentUser.role === 'Admin' && (
             <DropdownMenuItem asChild>
                <Link href="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                </Link>
             </DropdownMenuItem>
        )}
         {currentUser.role === 'FacilityOwner' && (
             <DropdownMenuItem asChild>
                <Link href="/owner">
                    <HandCoins className="mr-2 h-4 w-4" />
                    <span>Owner Portal</span>
                </Link>
             </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Exit</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
