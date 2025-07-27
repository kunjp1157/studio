
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
import { getStaticUsers } from "@/lib/mock-data";


const allMockUsers: Record<'admin' | 'owner' | 'user', UserProfile | undefined> = {
  admin: getStaticUsers().find(u => u.role === 'Admin'),
  owner: getStaticUsers().find(u => u.role === 'FacilityOwner'),
  user: getStaticUsers().find(u => u.role === 'User'),
};

export function UserSwitcher() {
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState('admin');

  useEffect(() => {
    // On initial load, set the active user in session storage if not already set.
    const storedUser = sessionStorage.getItem('activeUser');
    if (storedUser) {
        const activeUser = JSON.parse(storedUser);
        setCurrentUserRole(activeUser.role?.toLowerCase() || 'admin');
    } else {
        const adminUser = allMockUsers.admin;
        if (adminUser) {
            sessionStorage.setItem('activeUser', JSON.stringify(adminUser));
            setCurrentUserRole('admin');
        }
    }
  }, []);

  const handleValueChange = (value: 'admin' | 'owner' | 'user') => {
    const newActiveUser = allMockUsers[value];
    if (!newActiveUser) return;
    
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
