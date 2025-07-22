
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";
import { UserCog } from "lucide-react";
import { useState, useEffect } from "react";
import type { UserProfile, UserRole, UserStatus } from "@/lib/types";

// The user data is now self-contained within this client component
// to avoid importing from `lib/data.ts` which uses the `pg` driver.
const allMockUsers: Record<'admin' | 'owner' | 'user', UserProfile> = {
  admin: { 
    id: 'user-admin-kirtan', 
    name: 'Kirtan Shah', 
    email: 'kirtan.shah@example.com', 
    role: 'Admin' as UserRole, 
    status: 'Active' as UserStatus,
    joinedAt: new Date().toISOString(), 
    loyaltyPoints: 1250, 
    profilePictureUrl: 'https://randomuser.me/api/portraits/men/75.jpg', 
    dataAiHint: 'man smiling',
    isProfilePublic: true,
  },
  owner: { 
    id: 'user-owner-dana', 
    name: 'Dana White', 
    email: 'dana.white@example.com', 
    role: 'FacilityOwner' as UserRole, 
    status: 'Active' as UserStatus,
    joinedAt: new Date().toISOString(), 
    loyaltyPoints: 450, 
    profilePictureUrl: 'https://randomuser.me/api/portraits/women/68.jpg', 
    dataAiHint: 'woman portrait',
    isProfilePublic: true,
  },
  user: {
    id: 'user-regular-charlie',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    role: 'User' as UserRole,
    status: 'Active' as UserStatus,
    joinedAt: new Date().toISOString(),
    loyaltyPoints: 800,
    profilePictureUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    dataAiHint: 'man glasses',
    isProfilePublic: true,
  }
};

export function UserSwitcher() {
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState('admin');

  useEffect(() => {
    // On initial load, set the active user in session storage if not already set.
    if (!sessionStorage.getItem('activeUser')) {
      sessionStorage.setItem('activeUser', JSON.stringify(allMockUsers.admin));
    }
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser') || '{}');
    setCurrentUserRole(activeUser.role?.toLowerCase() || 'admin');

  }, []);

  const handleValueChange = (value: 'admin' | 'owner' | 'user') => {
    const newActiveUser = allMockUsers[value];
    
    // Store the new user in session storage for client components to access.
    sessionStorage.setItem('activeUser', JSON.stringify(newActiveUser));
    
    // Dispatch a custom event to notify other components (like UserNav) immediately.
    window.dispatchEvent(new Event('userChanged'));

    setCurrentUserRole(value);
    router.refresh(); 
  }

  return (
    <div className="flex items-center space-x-2">
        <UserCog className="h-5 w-5 text-muted-foreground" />
        <Select 
            value={currentUserRole} 
            onValueChange={handleValueChange}
        >
        <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="Switch User" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="user">User</SelectItem>
        </SelectContent>
        </Select>
    </div>
  )
}
