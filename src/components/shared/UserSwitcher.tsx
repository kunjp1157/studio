
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { setActiveMockUser, mockUser } from "@/lib/data";
import { useRouter } from "next/navigation";
import { UserCog } from "lucide-react";
import { useState, useEffect } from "react";

export function UserSwitcher() {
  const router = useRouter();
  // Initialize state from the current mockUser to ensure consistency
  const [currentUserRole, setCurrentUserRole] = useState(mockUser.role.toLowerCase());

  useEffect(() => {
    // This effect ensures that if the mockUser changes from another source,
    // the dropdown reflects that change.
    setCurrentUserRole(mockUser.role.toLowerCase());
  }, [mockUser]);

  const handleValueChange = (value: 'admin' | 'owner' | 'user') => {
    setActiveMockUser(value);
    setCurrentUserRole(value);
    // Refresh the page to make all components aware of the new user role
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
