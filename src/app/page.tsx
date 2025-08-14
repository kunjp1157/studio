
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '@/lib/types';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ParallaxElement = ({ speed, children, className }: { speed: number; children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        if (ref.current) {
            const scrollY = window.pageYOffset;
            ref.current.style.transform = `translateY(${scrollY * speed}px)`;
        }
    }, [speed]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};

export default function HomePage() {
  const [isPreloading, setIsPreloading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
        setCurrentUser(JSON.parse(activeUser));
    }
    
    // Use a timer to hide the preloader
    const timer = setTimeout(() => {
        setIsPreloading(false);
    }, 500); // Adjust time as needed

    // Clean up the timer
    return () => clearTimeout(timer);
  }, []);
  
  const handleGetStartedClick = () => {
      if(currentUser) {
          router.push('/facilities');
      } else {
          router.push('/account/login');
      }
  }

  return (
    <div className="text-white font-sans antialiased relative overflow-x-hidden min-h-screen">
      {isPreloading && (
        <div id="preloader" className="fixed inset-0 bg-brand-dark z-50 flex justify-center items-center transition-opacity duration-500">
          <div className="w-16 h-16 border-4 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <ParallaxElement speed={0.3} className="absolute top-[-10vh] left-[-15vw] w-[45vw] h-[70vh]">
          <div className="w-full h-full bg-brand-pink transform -rotate-45 rounded-3xl opacity-90"></div>
        </ParallaxElement>
        <ParallaxElement speed={0.5} className="absolute bottom-[-20vh] left-[5vw] w-[45vw] h-[70vh]">
          <div className="w-full h-full bg-brand-blue transform -rotate-45 rounded-3xl opacity-90"></div>
        </ParallaxElement>
        <ParallaxElement speed={0.2} className="absolute top-[-15vh] right-[5vw] w-[45vw] h-[70vh]">
          <div className="w-full h-full bg-brand-blue transform -rotate-45 rounded-3xl opacity-90"></div>
        </ParallaxElement>
         <ParallaxElement speed={0.6} className="absolute bottom-[20vh] right-[-5vw] w-[20vw] h-[35vh]">
          <div className="w-full h-full bg-brand-pink transform -rotate-45 rounded-3xl opacity-90"></div>
        </ParallaxElement>
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-wider leading-tight animated animate-fade-in-up animation-delay-200 text-gradient">SPORTS ARENA</h1>
            <p className="mt-4 max-w-lg mx-auto text-gray-300 leading-relaxed animated animate-fade-in-up animation-delay-400" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>Your ultimate destination for booking sports facilities, joining events, and connecting with players. Your next game is just a click away.</p>
            <Button
                id="get-started-btn"
                className="mt-8 bg-white text-brand-dark font-bold py-4 px-10 rounded-full text-sm tracking-wider transition-all duration-300 shadow-lg shadow-brand-pink/20 animated animate-fade-in-up animation-delay-600 relative overflow-hidden group hover:scale-105"
                size="lg"
                onClick={handleGetStartedClick}
              >
                  <span className="relative z-10">{currentUser ? 'BROWSE FACILITIES' : 'GET STARTED'}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></span>
            </Button>
          </div>
        </main>
      </div>

       {isModalOpen && (
            <div id="modal" className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4 transition-opacity duration-300" onClick={() => setIsModalOpen(false)}>
            <div id="modal-content" className="bg-white text-brand-dark rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-zoom-in" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-gradient">Welcome to Sports Arena!</h2>
                <p className="text-gray-600 mb-6">Join our community to book facilities, find players, and start your sports journey today.</p>
                <Link href="/account/signup" passHref>
                    <Button className="w-full bg-gradient-to-r from-brand-pink to-brand-blue text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity h-auto">
                        Sign Up Now
                    </Button>
                </Link>
                <p className="text-xs text-center mt-3 text-gray-500">
                    Already have an account? <Link href="/account/login" className="text-brand-blue font-semibold hover:underline">Log in</Link>.
                </p>
                <button id="close-modal-btn" className="absolute top-4 right-4 text-gray-400 hover:text-gray-800" onClick={() => setIsModalOpen(false)}>
                    <X className="w-6 h-6" />
                </button>
            </div>
            </div>
        )}
    </div>
  );
}
