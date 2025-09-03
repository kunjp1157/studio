
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getUsersAction } from '@/app/actions';
import type { UserProfile } from '@/lib/types';
import { Heart, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const allUsers = await getUsersAction();
      const foundUser = allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());

      // In a real app, you would use a secure password hashing and comparison library (e.g., bcrypt)
      // For this project, we are doing a plain text comparison which is NOT secure.
      if (foundUser && foundUser.password === password) {
        sessionStorage.setItem('activeUser', JSON.stringify(foundUser));
        window.dispatchEvent(new Event('userChanged'));

        toast({
          title: 'Logged In Successfully!',
          description: `Welcome back, ${foundUser.name}!`,
        });
        
        // Redirect based on role
        if (foundUser.role === 'Admin') {
          router.push('/admin/dashboard');
        } else if (foundUser.role === 'FacilityOwner') {
            router.push('/owner/dashboard');
        } else {
            router.push('/dashboard');
        }
      } else {
         toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
       toast({
          title: 'Login Error',
          description: 'An unexpected error occurred. Please try again later.',
          variant: 'destructive',
        });
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-container">
          <div className="auth-form-wrapper">
            <h2 className="auth-title flex items-center gap-2">
              <LogIn />
              <span>Sign In</span>
              <Heart style={{ color: 'var(--auth-form-accent-pink)', filter: 'drop-shadow(0 0 5px var(--auth-form-accent-pink))'}}/>
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
