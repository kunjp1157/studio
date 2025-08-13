
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Menu, X } from 'lucide-react';

const BackgroundShapes = () => (
  <div className="absolute inset-0 z-0 w-full h-full" id="parallax-container">
    <div data-parallax-speed="0.3" className="absolute top-[-10vh] left-[-15vw] w-[45vw] h-[70vh]">
      <div className="w-full h-full bg-brand-pink transform -rotate-45 rounded-3xl opacity-90"></div>
    </div>
    <div data-parallax-speed="0.5" className="absolute bottom-[-20vh] left-[5vw] w-[45vw] h-[70vh]">
      <div className="w-full h-full bg-brand-blue transform -rotate-45 rounded-3xl opacity-90"></div>
    </div>
    <div data-parallax-speed="0.2" className="absolute top-[-15vh] right-[5vw] w-[45vw] h-[70vh]">
      <div className="w-full h-full bg-brand-blue transform -rotate-45 rounded-3xl opacity-90"></div>
    </div>
    <div data-parallax-speed="0.6" className="absolute bottom-[20vh] right-[-5vw] w-[20vw] h-[35vh]">
      <div className="w-full h-full bg-brand-pink transform -rotate-45 rounded-3xl opacity-90"></div>
    </div>
    <div data-parallax-speed="0.4" className="absolute top-[15%] right-[15%] w-64 h-64">
      <div className="w-full h-full rounded-full border-2 border-white/10">
        <div className="w-full h-full rounded-full border-2 border-white/10 scale-75"></div>
      </div>
    </div>
    <div data-parallax-speed="0.7" className="absolute bottom-[10%] left-[5%] w-40 h-40">
      <div className="w-full h-full rounded-full border-2 border-white/10"></div>
    </div>
  </div>
);

const GetStartedModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { toast } = useToast();
    const handleSignup = () => {
        toast({ title: 'Success!', description: 'Thank you for signing up.' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div id="modal" className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
            <div id="modal-content" className="bg-white text-brand-dark rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-zoom-in" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-gradient">Get Started</h2>
                <p className="text-gray-600 mb-6">Join our community and start your fitness journey today. Enter your email to get exclusive access.</p>
                <Input type="email" placeholder="your.email@example.com" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue mb-4 text-black" />
                <Button onClick={handleSignup} className="w-full bg-gradient-to-r from-brand-pink to-brand-blue text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                    Sign Up
                </Button>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Preloader effect
    const timer = setTimeout(() => setLoading(false), 500);

    // Parallax scroll effect
    const handleScroll = () => {
        const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
        const scrollY = window.pageYOffset;
        parallaxElements.forEach(el => {
            const speed = parseFloat((el as HTMLElement).dataset.parallaxSpeed || '0');
            (el as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-brand-dark text-white font-sans antialiased relative overflow-x-hidden min-h-screen">
      {loading && (
        <div id="preloader" className="fixed inset-0 bg-brand-dark z-[100] flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <BackgroundShapes />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="w-full animated animate-fade-in-up sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-6 py-4 border-b border-white/10 bg-brand-dark/50 backdrop-blur-md">
                <nav className="flex items-center justify-between">
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/facilities" className="text-sm font-bold tracking-wider text-gray-300 hover:text-white transition-colors">FACILITIES</Link>
                        <Link href="/events" className="text-sm font-bold tracking-wider text-gray-300 hover:text-white transition-colors">EVENTS</Link>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                           <Menu className="w-6 h-6"/>
                        </button>
                    </div>
                    <div className="text-2xl font-black tracking-widest absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
                       <Link href="/">ARENA</Link>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                       <Link href="/memberships" className="text-sm font-bold tracking-wider text-gray-300 hover:text-white transition-colors">MEMBERSHIPS</Link>
                       <Link href="/contact" className="text-sm font-bold tracking-wider text-gray-300 hover:text-white transition-colors">CONTACT</Link>
                    </div>
                    <div className="md:hidden w-8"></div>
                </nav>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden bg-brand-dark/90 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 py-4">
                        <Link href="/facilities" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold tracking-wider text-gray-300 hover:text-white transition-colors">FACILITIES</Link>
                        <Link href="/events" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold tracking-wider text-gray-300 hover:text-white transition-colors">EVENTS</Link>
                        <Link href="/memberships" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold tracking-wider text-gray-300 hover:text-white transition-colors">MEMBERSHIPS</Link>
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold tracking-wider text-gray-300 hover:text-white transition-colors">CONTACT</Link>
                    </div>
                </div>
            )}
        </header>

        <main className="flex-grow flex items-center justify-center text-center px-4 -mt-16">
            <div className="max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-black tracking-wider leading-tight animated animate-fade-in-up animation-delay-200 text-gradient">
                    SPORTS ARENA
                </h1>
                <p className="mt-4 max-w-lg mx-auto text-gray-300 leading-relaxed animated animate-fade-in-up animation-delay-400">
                    Your ultimate destination for booking sports facilities. Find a court, field, or pool and get playing today!
                </p>
                <Button
                    onClick={() => setModalOpen(true)}
                    className="mt-8 bg-white text-brand-dark font-bold py-7 px-10 rounded-full text-sm tracking-wider transition-all duration-300 shadow-lg shadow-brand-pink/20 animated animate-fade-in-up animation-delay-600 relative overflow-hidden group hover:bg-white"
                >
                    <span className="relative z-10">GET STARTED</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></span>
                </Button>
            </div>
        </main>
      </div>
      <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
