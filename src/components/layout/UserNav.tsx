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
import { User, LogIn, UserPlus, LayoutDashboard, CalendarDays, LogOut, CreditCard } from 'lucide-react';
import { mockUser } from '@/lib/data'; // For mock data

export function UserNav() {
  // Mock authentication state. In a real app, this would come from a context or auth service.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  // Effect to prevent hydration mismatch for a potentially random initial state
  useEffect(() => {
    // Simulate checking auth status (e.g., from localStorage or an API call)
    // For now, let's randomly decide if the user is authenticated for demo purposes.
    // In a real app, this should be a stable check.
    const authStatus = Math.random() > 0.5; // This is just for demo
    setIsAuthenticated(authStatus);
    if (authStatus) {
      setUserName(mockUser.name);
      setUserEmail(mockUser.email);
      setUserAvatar(mockUser.profilePictureUrl || '');
    }
  }, []);


  const handleLogout = () => {
    setIsAuthenticated(false);
    // Add actual logout logic here
  };

  // Temporary function to simulate login for testing
  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserName(mockUser.name);
    setUserEmail(mockUser.email);
    setUserAvatar(mockUser.profilePictureUrl || '');
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={handleLogin}> {/* Temporary login button */}
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Button>
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
          <Link href="/account/profile" passHref>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/account/bookings" passHref>
            <DropdownMenuItem>
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>My Bookings</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/account/payment-methods" passHref>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Payment Methods</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="/admin" passHref>
            <DropdownMenuItem>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
