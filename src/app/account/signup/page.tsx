
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { AnimatedGridBackground } from '@/components/layout/AnimatedGridBackground';
import { Heart, UserPlus } from 'lucide-react';
import { addUser } from '@/lib/data';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    
    try {
      await addUser({ name: username, email });
      
      toast({
        title: 'Account Created!',
        description: `Welcome to Sports Arena, ${username}! Please log in.`,
      });
      router.push('/account/login');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        title: 'Signup Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AnimatedGridBackground />
      <div className="auth-box">
        <div className="auth-container">
          <div className="auth-form-wrapper">
            <h2 className="auth-title flex items-center gap-2">
              <UserPlus />
              <span>Register</span>
              <Heart style={{ color: 'var(--auth-form-accent-pink)', filter: 'drop-shadow(0 0 5px var(--auth-form-accent-pink))'}}/>
            </h2>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="auth-input"
              />
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
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="auth-input"
              />
              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size={20} /> : 'Sign Up'}
              </button>
              <div className="auth-group">
                <Link href="/account/login">Already have an account?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
