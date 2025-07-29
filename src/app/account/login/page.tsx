
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { User, Key, Heart, LogIn } from 'lucide-react';
import { AnimatedGridBackground } from '@/components/layout/AnimatedGridBackground';
import { getStaticUsers } from '@/lib/mock-data';
import type { UserProfile } from '@/lib/types';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication: find a user with the matching email.
    // In a real app, this would be an API call that validates email and password.
    const allUsers = getStaticUsers();
    const foundUser = allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());

    setTimeout(() => {
      setIsLoading(false);

      if (foundUser) {
        // --- This is our mock login ---
        sessionStorage.setItem('activeUser', JSON.stringify(foundUser));
        window.dispatchEvent(new Event('userChanged')); // Notify other components like the header
        // ------------------------------

        toast({
          title: 'Logged In Successfully!',
          description: `Welcome back, ${foundUser.name}!`,
          className: 'bg-green-500 text-white',
        });
        router.push('/facilities');
      } else {
        toast({
          title: 'Login Failed',
          description: 'No user found with that email address. Please sign up.',
          variant: 'destructive',
        });
      }
    }, 1500);
  };

  return (
    <div className="auth-page">
      <AnimatedGridBackground />
      <div 
        className="auth-box"
      >
        <div className="auth-container">
          <div className="auth-form-wrapper">
            <h2 className="auth-title flex items-center gap-2">
              <LogIn />
              <span>Sign In</span>
              <Heart style={{ color: '#ff2770', filter: 'drop-shadow(0 0 5px #ff2770)'}}/>
            </h2>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size={20} /> : 'Sign In'}
              </button>
              <div className="auth-group">
                <Link href="/account/forgot-password">Forgot Password?</Link>
                <Link href="/account/signup">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
