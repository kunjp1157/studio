import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden bg-background text-foreground">
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight animated animate-fade-in-up text-gradient">
          SPORTS ARENA
        </h1>
        <p
          className="mt-4 max-w-lg mx-auto text-muted-foreground leading-relaxed animated animate-fade-in-up animation-delay-200"
          style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}
        >
          Your ultimate destination for booking sports facilities, joining
          events, and connecting with players. Your next game is just a click
          away.
        </p>
        <Button
          asChild
          className="mt-8 animated animate-fade-in-up animation-delay-400"
          size="lg"
        >
          <Link href="/facilities">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
