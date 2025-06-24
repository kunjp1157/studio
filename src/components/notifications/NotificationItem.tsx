
'use client';

import Link from 'next/link';
import type { AppNotification } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import {
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { getIconComponent } from '@/components/shared/Icon';

interface NotificationItemProps {
  notification: AppNotification;
  onMarkAsRead: (notificationId: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const IconComponent = getIconComponent(notification.iconName) || Info;

  const content = (
    <div className="flex items-start space-x-3 py-2 px-2 hover:bg-muted/50 rounded-md transition-colors">
      <div className={cn("mt-1", notification.isRead ? 'text-muted-foreground' : 'text-primary' )}>
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-0.5">
        <p className={cn("text-sm font-medium", notification.isRead && "text-muted-foreground")}>
          {notification.title}
        </p>
        <p className={cn("text-xs", notification.isRead ? "text-muted-foreground/80" : "text-muted-foreground")}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/70">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
      {!notification.isRead && (
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto self-center text-xs text-muted-foreground hover:text-primary"
          onClick={(e) => {
            e.stopPropagation(); // Prevent dropdown from closing if this button is clicked
            onMarkAsRead(notification.id);
          }}
          aria-label="Mark as read"
        >
          <Check className="h-4 w-4 mr-1" /> Mark Read
        </Button>
      )}
    </div>
  );

  const itemContent = notification.link ? (
    <Link
      href={notification.link}
      className="block w-full cursor-pointer"
      onClick={() => {
        if (!notification.isRead) {
          onMarkAsRead(notification.id);
        }
        // Allow default link navigation to proceed
      }}
    >
      {content}
    </Link>
  ) : (
    <div className="block w-full cursor-default" onClick={() => !notification.isRead && onMarkAsRead(notification.id)}>
      {content}
    </div>
  );
  
  return (
    <DropdownMenuItem
        className={cn(
            "p-0 focus:bg-transparent data-[highlighted]:bg-muted/50",
            notification.isRead ? '' : 'bg-primary/5 hover:bg-primary/10 data-[highlighted]:bg-primary/10'
        )}
        onSelect={(e) => e.preventDefault()} // Prevent default close on select
    >
        {itemContent}
    </DropdownMenuItem>
  );
}
