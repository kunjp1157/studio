
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
import { getUsersAction } from "@/app/actions";

export function UserSwitcher() {
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState('admin');
  const [allUsers, setAllUsers] = useState<Record<'admin' | 'owner' | 'user', UserProfile | undefined>>({
    admin: undefined,
    owner: undefined,
    user: undefined,
  });

  useEffect(() => {
    const fetchAndSetUsers = async () => {
        const users = await getUsersAction();
        setAllUsers({
            admin: users.find(u => u.role === 'Admin'),
            owner: users.find(u => u.role === 'FacilityOwner'),
            user: users.find(u => u.role === 'User' && u.email.startsWith('charlie')), // Be more specific for the default user
        });
    };
    fetchAndSetUsers();
  }, []);

  useEffect(() => {
    // On initial load, set the active user in session storage if not already set.
    const storedUser = sessionStorage.getItem('activeUser');
    if (storedUser) {
        const activeUser = JSON.parse(storedUser);
        const role = activeUser.role?.toLowerCase() as 'admin' | 'owner' | 'user';
        setCurrentUserRole(role);
    } else if (allUsers.admin) {
        sessionStorage.setItem('activeUser', JSON.stringify(allUsers.admin));
        setCurrentUserRole('admin');
        window.dispatchEvent(new Event('userChanged'));
    }
  }, [allUsers]);

  const handleValueChange = (value: 'admin' | 'owner' | 'user') => {
    const newActiveUser = allUsers[value];
    if (!newActiveUser) return;
    
    sessionStorage.setItem('activeUser', JSON.stringify(newActiveUser));
    window.dispatchEvent(new Event('userChanged'));

    setCurrentUserRole(value);
    
    // Redirect to a safe page after role switch
    if(value === 'admin') router.push('/admin/dashboard');
    else if (value === 'owner') router.push('/owner/dashboard');
    else router.push('/dashboard');
    
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
