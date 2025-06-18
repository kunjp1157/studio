import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';
import { MountainSnow } from 'lucide-react'; // Placeholder icon for logo

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
        <nav className="flex flex-1 items-center space-x-4">
          <Link href="/facilities">
            <Button variant="ghost" className="text-sm font-medium">Facilities</Button>
          </Link>
          <Link href="/events">
            <Button variant="ghost" className="text-sm font-medium">Events</Button>
          </Link>
          <Link href="/memberships">
            <Button variant="ghost" className="text-sm font-medium">Memberships</Button>
          </Link>
          <Link href="/recommendation">
            <Button variant="ghost" className="text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90">AI Recommender</Button>
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
