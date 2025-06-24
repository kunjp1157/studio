
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { User, LogIn, UserPlus, LayoutDashboard, CalendarDays, LogOut, CreditCard, Heart, Group } from 'lucide-react';
import { mockUser } from '@/lib/data'; // For mock data

export function UserNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  // This effect runs only on the client-side after hydration, preventing mismatches.
  useEffect(() => {
    // In a real app, this would be an API call or a check to localStorage/cookies.
    // For this demo, we'll consistently set the user as logged in to showcase features.
    setIsAuthenticated(true);
    setUserName(mockUser.name);
    setUserEmail(mockUser.email);
    setUserAvatar(mockUser.profilePictureUrl || '');
  }, []);


  const handleLogout = () => {
    setIsAuthenticated(false);
    // Add actual logout logic here
  };

  // If the component renders before the client-side effect runs,
  // it will show the login/signup buttons, avoiding a server/client mismatch.
  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/account/login">
            <Button variant="outline">
                <LogIn className="mr-2 h-4 w-4" />
                Login
            </Button>
        </Link>
        <Link href="/account/signup">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>
              {userName
                ? userName
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
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
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
        <DropdownMenuItem asChild>
          <Link href="/admin">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Admin Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
