import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 font-headline">City Sports Hub</h3>
            <p className="text-sm text-muted-foreground">
              Your one-stop destination for booking sports facilities in the city.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 font-headline">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/facilities" className="text-muted-foreground hover:text-primary transition-colors">Facilities</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="/memberships" className="text-muted-foreground hover:text-primary transition-colors">Memberships</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 font-headline">Connect With Us</h4>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} City Sports Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
