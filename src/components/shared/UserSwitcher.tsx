
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { allMockUsers, setActiveMockUser } from "@/lib/data";
import { useRouter } from "next/navigation";
import { UserCog } from "lucide-react";
import { useState, useEffect } from "react";

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
    setActiveMockUser(value); // This still updates the server-side mock for any server components.
    
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
