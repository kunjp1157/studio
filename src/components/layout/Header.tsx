
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';
import { MountainSnow, Dices, Wand2 } from 'lucide-react'; // Placeholder icon for logo
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <MountainSnow className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg font-headline">
            City Sports Hub
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-1 sm:space-x-2 md:space-x-4">
          <Link href="/facilities">
            <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3">Facilities</Button>
          </Link>
          <Link href="/sports">
            <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3">
                <Dices className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Sports</span>
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3">Events</Button>
          </Link>
          <Link href="/memberships">
            <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3">Memberships</Button>
          </Link>
          <Link href="/recommendation">
            <Button variant="ghost" className="text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 px-2 sm:px-3">
                <Wand2 className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">AI Recommender</span>
                <span className="sm:hidden">AI</span>
            </Button>
          </Link>
        </nav>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <NotificationBell />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
