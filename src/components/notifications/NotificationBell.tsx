
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
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
import type { AppNotification } from '@/lib/types';
import { mockUser, getNotificationsForUser, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/data';
import { NotificationItem } from './NotificationItem';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching notifications
    const userNotifications = getNotificationsForUser(mockUser.id);
    setNotifications(userNotifications);
    setUnreadCount(userNotifications.filter(n => !n.isRead).length);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Refresh notifications when opening, though in a real app this might be handled by websockets or polling
      const userNotifications = getNotificationsForUser(mockUser.id);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.isRead).length);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(mockUser.id, notificationId);
    const updatedNotifications = getNotificationsForUser(mockUser.id);
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.isRead).length);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(mockUser.id);
    const updatedNotifications = getNotificationsForUser(mockUser.id);
    setNotifications(updatedNotifications);
    setUnreadCount(0);
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
                {recentNotifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
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
