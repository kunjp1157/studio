
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { AppNotification, UserProfile } from '@/lib/types';
import { NotificationItem } from './NotificationItem';
import { getNotificationsForUserAction, markNotificationAsReadAction, markAllNotificationsAsReadAction } from '@/app/actions';
import { getIconComponent } from '@/components/shared/Icon';

export function NotificationBell() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
        setCurrentUser(JSON.parse(activeUser));
    }
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

  const fetchNotifications = async () => {
    if (!currentUser) return;
    const userNotifications = await getNotificationsForUserAction(currentUser.id);
    const newUnreadCount = userNotifications.filter(n => !n.isRead).length;

    setNotifications(userNotifications);
    setUnreadCount(newUnreadCount);
  };

  useEffect(() => {
    if (currentUser) {
        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 5000);
        return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!currentUser) return;
    await markNotificationAsReadAction(currentUser.id, notificationId);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    if (!currentUser) return;
    await markAllNotificationsAsReadAction(currentUser.id);
    fetchNotifications();
  };
  
  const recentNotifications = notifications.slice(0, 5);

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 md:w-96" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {notifications.length > 0 && unreadCount > 0 && (
             <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={handleMarkAllRead}>
                <CheckCheck className="mr-1 h-3 w-3" /> Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled className="text-center text-muted-foreground py-4">
            No new notifications
          </DropdownMenuItem>
        ) : (
          <>
            <ScrollArea className="h-[300px]">
              <DropdownMenuGroup>
                {recentNotifications.map((notification) => {
                  const IconComponent = getIconComponent(notification.iconName) || Info;
                  return (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      onMarkAsRead={handleMarkAsRead}
                      IconComponent={IconComponent}
                    />
                  );
                })}
              </DropdownMenuGroup>
            </ScrollArea>
            {notifications.length > 5 && (
                <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/account/notifications" className="w-full text-center justify-center">
                        View all notifications
                    </Link>
                </DropdownMenuItem>
                </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
